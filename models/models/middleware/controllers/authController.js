
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, rollNumber, department, year } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashed = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashed,
            rollNumber,
            department,
            year
        });

        res.status(201).json({
            message: "Registration successful",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid login details"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.profile = async (req, res) => {
    res.json({ user: req.user });
};
