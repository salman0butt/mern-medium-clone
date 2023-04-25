const {body, validationResult} = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/User");
const createToken = (user) => {
    return jwt.sign({user}, process.env.SECERT, {
        expiresIn: '7d'
    });
}

module.exports.registerValidations = [
    body("name").not().isEmail().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("password").isLength({min: 6}).withMessage("Pasword must be atleast 6 leter")
];

module.exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const checkUser = await User.findOne({email});
        if (checkUser) {
            return res.status(400).json({errors: [{msg: "Email is already taken."}]})
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        try {
            const user = await User.create({
                name,
                email,
                password: hash,
            });
            const token = createToken(user);
            return res.status(200).json({msg: "Your account has been created", token});
        } catch (err) {
            return res.status(500).json({errors: err});
        }
    } catch
        (err) {
        return res.status(500).json({errors: err});
    }
};

module.exports.loginValidations = [
    body("email").not().isEmpty().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required")
];

module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (user) {
            const matched = await bcrypt.compare(password, user.password);
            if (matched) {
                const token = createToken();
                return res.status(200).json({msg: "Your account has been created", token});
            } else {
                return res.status(404).json({errors: [{msg: 'Password is not correct.'}]});
            }
        } else {
            return res.status(404).json({errors: [{msg: 'Email not found'}]});
        }
    } catch (err) {
        return res.status(500).json({errors: err});
    }
};

