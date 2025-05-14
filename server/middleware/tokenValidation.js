import jwt from 'jsonwebtoken'

const validateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
};

export default validateToken
