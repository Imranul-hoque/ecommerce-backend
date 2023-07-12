const express = require('express');
const { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteUser, updateUser, userBlocked, userunBlocked, handleRefreshToken, logout, updatePassword, forgetPasswordToken, resetPassword } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const route = express.Router();

route.post('/register', createUser)
route.post('/forget-password-token', forgetPasswordToken);
route.post('/login', loginUserCtrl);
route.get('/all-user', getAllUser);
route.get('/refresh', handleRefreshToken);
route.get('/logout', logout);
route.put('/password-reset/:token', resetPassword)
route.put('/change-password', authMiddleware, updatePassword);
route.delete('/:id', deleteUser);
route.put('/:id', updateUser);
route.get('/:id', authMiddleware, isAdmin, getSingleUser);
route.put('/user-blocked/:id', authMiddleware, isAdmin, userBlocked);
route.put('/user-unblocked/:id',authMiddleware, isAdmin, userunBlocked);

module.exports = route;