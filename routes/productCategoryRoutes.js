const express = require('express');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const {  
    createProductCategory, 
    updateProductCategory, 
    delelteProductCategory ,
    getAllProductCategory,
    getSingleProductCategory } = require('../controller/productCategoryCtrl');

route.post('/create', authMiddleware, isAdmin, createProductCategory );
route.put('/update/:id', authMiddleware, isAdmin, updateProductCategory);
route.delete('/delete/:id', authMiddleware, isAdmin, delelteProductCategory );
route.get('/getallcategory', authMiddleware, isAdmin, getAllProductCategory );
route.get('/getsinglecategory/:id', authMiddleware, isAdmin, getSingleProductCategory);


module.exports = route;