const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
    req.request_id = uuidv4();
    res.setHeader("X-Request-ID", req.request_id);
    next();
};
