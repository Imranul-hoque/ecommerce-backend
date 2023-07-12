const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers?.authorization.split(' ')[1];
        try {
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user  = await User.findById(decode?.id)
                req.user = user;
                next();
            }
            
        } catch (error) {
            throw new Error('token is not valid')
        }

    } else {
        throw new Error('token is not provied')
    }
})


const isAdmin = asyncHandler(async (req,res,next) => {
    try {
        const { email } = req.user;
        const adminUser = await User.findOne({ email });
        
        if (adminUser.role !== 'admin') {
            throw new Error('user is not admin')
        } else {
            next();
        }
        
        
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { authMiddleware, isAdmin }