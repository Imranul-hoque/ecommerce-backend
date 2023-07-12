const express = require('express');
const { createProduct, getAllProduct, getSingleProdut, updateProduct, deleteProduct, addToList, rating } = require('../controller/productCtrl');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares')


route.post('/create', createProduct);
route.put('/wishlist', authMiddleware, addToList);
route.put('/rating', authMiddleware, rating);
route.get('/all-product', authMiddleware,isAdmin,getAllProduct);
route.get('/:id', authMiddleware,isAdmin, getSingleProdut);
route.put('/:id', authMiddleware,isAdmin, updateProduct);
route.delete('/:id', authMiddleware,isAdmin, deleteProduct);


module.exports = route;