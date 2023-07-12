const express = require('express');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const {  
    createBlogCategory, 
    updateBlogCategory, 
    delelteBlogCategory ,
    getAllBlogCategory,
    getSingleBlogCategory
     } = require('../controller/blogCategoryCtrl');

route.post('/create', authMiddleware, isAdmin, createBlogCategory );
route.put('/update/:id', authMiddleware, isAdmin, updateBlogCategory);
route.delete('/delete/:id', authMiddleware, isAdmin, delelteBlogCategory );
route.get('/getallcategory', authMiddleware, isAdmin, getAllBlogCategory );
route.get('/getsinglecategory/:id', authMiddleware, isAdmin, getSingleBlogCategory);


module.exports = route;