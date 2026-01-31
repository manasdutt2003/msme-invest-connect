module.exports = function (roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Access denied for role '${req.user.role}'. Required: ${roles.join(' or ')}`
            });
        }

        next();
    };
};
