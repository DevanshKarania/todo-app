const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    console.log("REGISTER ROUTE HIT");
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }

    userModel.getUserByUsername(
        username,
        async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false
                });
            }
            if (results.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Username already exists."
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = { username, password: hashedPassword };

            userModel.createUser(
                user,
                (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User registered successfully."
                    });
                });
        });
}

async function login(req, res) {
    console.log("LOGIN ROUTE HIT");
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }

    userModel.getUserByUsername(username, async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false
            });
        }
        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    });
}

module.exports = {
    register,
    login
};