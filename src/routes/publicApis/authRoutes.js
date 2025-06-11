const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Employee } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/baseResponse");

/**
 * @swagger
 * /public/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin user and return JWT token.
 *     tags:
 *       - Auth
 *     security: []  # <-- This disables bearer token for this route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: secretpassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid password/username or access denied
 *       500:
 *         description: Server error
 */

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Employee.findOne({
            where: {
                username,
                isAdmin: true,
            },
        });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid username or access denied" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Prepare payload for JWT
        const payload = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        return successResponse(res, "You are logged in now", {
            userName: user.username,
            fullName: user.fullName,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        // return res.status(500).json({ message: "Server error" });
        return errorResponse(500, "Server error");
    }
});

module.exports = router;
