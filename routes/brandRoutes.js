const express = require('express');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const {  
    createBrandCategory, 
    updateBrandCategory, 
    delelteBrandCategory ,
    getAllBrandCategory,
    getSingleBrandCategory
     } = require('../controller/brandCtrl');

route.post('/create', authMiddleware, isAdmin, createBrandCategory );
route.put('/update/:id', authMiddleware, isAdmin, updateBrandCategory);
route.delete('/delete/:id', authMiddleware, isAdmin, delelteBrandCategory );
route.get('/getallbrand', authMiddleware, isAdmin, getAllBrandCategory );
route.get('/getsinglebrand/:id', authMiddleware, isAdmin, getSingleBrandCategory);


module.exports = route;