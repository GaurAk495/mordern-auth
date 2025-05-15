import userModel from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import resend from '../mailer.js'
import { tempMail, accountcreated, verificationOTPsent, acVerSuccess, resetOTPsent, resetPassSuccess } from '../utils/mailtemplate.js'

const isProduction = process.env.STAGE === 'production';
// console.log('STAGE:', process.env.STAGE);

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: `User doesn't exist. Please signup first.` });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        return res.status(401).json({ success: false, message: 'Incorrect Email or Password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });

    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });

    res.json({ success: true, message: 'Login successfully', info: { name: user.name, email: user.email }, accountVerified: user.isAcVerified });
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new userModel({ name, email, password: hashedPassword });


        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });

        // Set cookie
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });

        // Send confirmation email
        const mailOptions = {
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Account Created Successfully',
            html: tempMail(accountcreated).replace(`{{name}}`, user.name)
        };

        try {
            const info = await resend.emails.send(mailOptions);
            console.log('Confirmation email sent:', info.data.id);
            await user.save();
            // Final response
            res.status(201).json({
                success: true,
                message: 'Account created successfully.',
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr.message);
            res.json({ success: false, message: 'SMTP error' })
            // You may choose not to return an error here if email failure is not critical
        }

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict',
        path: '/'
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
}

const isAcVerified = async (req, res) => {
    const { userId } = req.user
    const user = await userModel.findById(userId)
    if (user.isAcVerified === true) {
        return res.json({ success: true, message: 'Account is Verified' })
    } else {
        return res.json({ success: false, message: 'Account is not Verified' })
    }
}

const isUserLoggedIn = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Missing user ID' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Please login again.' });
        }

        res.status(200).json({ success: true, message: 'Account is authenticated.', info: { name: user.name, email: user.email }, accountVerified: user.isAcVerified });
    } catch (error) {
        console.error('Error checking user login:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const sendVerifyEmail = async (req, res) => {
    const { userId } = req.user

    const user = await userModel.findById(userId)
    const otp = Math.floor(1000 + Math.random() * 9000);

    user.verifiyOtp = otp
    user.verifyOtpExpirtat = Date.now() + 1000 * 60 * 60 * 24
    await user.save()

    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: "Verification OTP Send Successfully",
        html: tempMail(verificationOTPsent).replace(`{{otp}}`, otp)
    };

    try {
        const info = await resend.emails.send(mailOptions);
        res.json({ success: true, message: 'Verifcation Mail sent to your Email Successfully' })
    } catch (error) {
        console.log({ success: false, message: 'SMTP error', error: error.message })
    }
}

const verifyOtp = async (req, res) => {
    const { userId } = req.user
    const { otp } = req.body;

    if (!otp || !userId) {
        return res.status(400).json({ success: false, message: 'OTP or User ID is missing.' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found. Please sign up.' });
    }

    if (user.verifyOtpExpirtat < Date.now()) {
        return res.status(400).json({ success: false, message: 'OTP expired. Please resend verification email.' });
    }

    if (user.verifiyOtp !== otp) {
        return res.status(401).json({ success: false, message: 'OTP is incorrect.' });
    }

    user.isAcVerified = true;
    user.verifyOtpExpirtat = 0;
    user.verifiyOtp = '';

    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Account Verified Successfully',
        html: tempMail(acVerSuccess)
    };

    try {
        await resend.emails.send(mailOptions);
        await user.save();
        return res.json({ success: true, message: 'Account verified successfully.' });
    } catch (error) {
        console.error('SMTP error:', error.message);
        return res.status(500).json({ success: false, message: 'Verification successful, but email failed to send.' });
    }
};

const sendResetOTP = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 5 minutes from now

        // Save OTP and expiry in user document
        user.resetPwdOTP = otp;
        user.resetOtpVerifyat = otpExpiry;
        await user.save();

        // Send email
        const mailOptions = {
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Reset Password OTP',
            html: tempMail(resetOTPsent).replace(`{{otp}}`, otp)
        };

        await resend.emails.send(mailOptions);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email successfully',
        });

    } catch (error) {
        console.error('Error sending reset OTP:', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong. Try again later.' });
    }
}

const verifyResetOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body
    console.log(req.body)
    if (!email || !otp || !newPassword) {
        console.log('hi')
        return res.json({ success: false, message: 'fields cannot be empty' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.json({ success: false, message: 'user not found.' })
    }

    if (user.resetOtpVerifyat < Date.now()) {
        return res.json({ success: false, message: 'otp is expired. Do resend email again.' })
    }

    if (user.resetPwdOTP != otp) {
        return res.json({ success: false, message: 'incorrect OTP.' })
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)

    user.resetPwdOTP = '';
    user.resetOtpVerifyat = 0
    user.password = hashPassword

    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Hello World',
        html: tempMail(resetPassSuccess)
    }

    try {
        const info = await resend.emails.send({ mailOptions })
        user.save()

        res.json({ success: true, message: 'password reset Successfully' })
    } catch (error) {
        console.log('SMTP error', error.message)
        res.json({ sucess: false, message: 'SMTP error' })
    }

}


export { login, signup, logout, isAcVerified, isUserLoggedIn, sendVerifyEmail, verifyOtp, sendResetOTP, verifyResetOTP }