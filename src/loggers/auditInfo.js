module.exports = (req, res, next) => {
    req.auditInfo = {
        userId: req.user?.id || null,
        ipAddress: req.ip || req.connection.remoteAddress,
    };
    next();
};
