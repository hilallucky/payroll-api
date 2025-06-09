const jwt = require("jsonwebtoken");

function generateMockToken(payload, secret) {
    return jwt.verify(payload, secret);
}

module.exports = { generateMockToken };
