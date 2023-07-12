const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../controller/emailCtrl');
const crypto = require('crypto');




const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email : email });
    if (!findUser) {
        const { firstName, lastName, email, mobile, password } = req.body;
    const user = await User.create({
        firstName : firstName,
        lastName: lastName,
        email : email,
        mobile : mobile,
        password : password
      });

      res.json(user);
    } else {
       throw new Error('User is already exists');
    }
});

const loginUserCtrl = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({email})
    if (findUser && await findUser.isPasswordMatch(password)) {

        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser?._id, {
            refreshToken : refreshToken
        }, { new : true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly : true,
            maxAge : 72 * 60 * 60 * 1000
        })
        res.json({
            id : findUser?._id,
            firstName : findUser?.firstName,
            lastName : findUser?.lastName,
            email : findUser?.email,
            mobile : findUser?.mobile,
            token : generateToken(findUser?._id)
        });

    } else {
        throw new Error('user is not found')
    }
});

const handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie) throw new Error('no refresh token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error('No refreshToken in db');
    
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
        const accessToken = generateToken(user?._id);
        res.json({ accessToken })
    })
})

const logout = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('Cookie is not found')
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly : true,
            secure : true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken : ''
    });

    res.clearCookie('refreshToken', {
        httpOnly : true,
        secure : true
    });
    res.sendStatus(204);
})

const getAllUser = asyncHandler(async (req, res) => {
    const user = await User.find();
    try {
        res.json({user})
    } catch(error) {
        throw new Error(error);
    }
})

// UPDATE THE USER BY ID

const updateUser = asyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName : req.body?.firstName,
            lastName : req.body?.lastName,
            email : req.body?.email,
            mobile : req.body?.mobile,
        }, { new : true });

        res.json({
            message : 'user updated successfully',
            user : updatedUser
        })
        
    } catch (error) {
        throw new Error(error)
    }
})


const updatePassword = asyncHandler(async (req,res) => {
    try {
        const { _id } = req.user;
        const { password } = req.body;
        const user = await User.findById(_id);
        if (password) {
            user.password = password
            const updatePass = await user.save();
            res.json(updatePass)
        } else{
            res.json(user)
        }
        
    } catch (error) {
        throw new Error(error)
    }
})

const forgetPasswordToken = asyncHandler(async (req,res) => {

    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) throw new Error('User is not found');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Please follow this link to reset the password <a href='http://localhost:5000/api/user/password-reset/${token}'>Click here </a>`;
        const data = {
            to : email,
            text : 'hey user',
            subject : 'forget password link',
            html : resetUrl
        };
        
        sendEmail(data)
        res.json(token)
        
    } catch (error) {
        throw new Error(error)
    }

})

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : { $gt : Date.now() }
    });
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json({ user })

    if(!user) throw new Error('Token has been expires');
})

// GET USER BY ID
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const singleUser = await User.findById(id);
        res.json({
            singleUser
        })
        
    } catch (error) {
        throw new Error(error);
    }
});

// delete user 

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);


    try {
        await User.findByIdAndDelete(id);
        res.json({
            message : 'user has been deleted successfully'
        })

        
    } catch (error) {
        throw new Error(error)
    }
})


const userBlocked = asyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongoId(id);

    try {

        const updateBlocked = await User.findByIdAndUpdate(id, {
            isBlocked : true
        }, { new : true })
        res.json({
            message : 'user has been blocked',
            updated : updateBlocked
        })
        
    } catch (error) {
        throw new Error(error);
    }
})
const userunBlocked = asyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongoId(id)
    try {

        const updateunBlocked = await User.findByIdAndUpdate(id, {
            isBlocked : false
        }, { new : true })
        res.json({
            message : 'user has been un blocked',
            updated : updateunBlocked
        })
        
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createUser, 
    loginUserCtrl, 
    getAllUser, 
    getSingleUser, 
    deleteUser,
    updateUser,
    userBlocked,
    userunBlocked,
    handleRefreshToken,
    logout,
    updatePassword,
    forgetPasswordToken,
    resetPassword
};