// src/middlewares/auth.js (mock version for test)
module.exports = (req, res, next) => {
    req.user = { id: 1, isAdmin: true };
    next();
};
