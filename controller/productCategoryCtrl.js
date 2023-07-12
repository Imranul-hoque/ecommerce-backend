const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');

const createProductCategory = asyncHandler(async (req,res) => {
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch(error) {
        throw new Error(error)
    }
});

const updateProductCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new : true })
       res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
});


const delelteProductCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const deletecategory = await Category.findByIdAndDelete(id)
       res.json(deletecategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllProductCategory = asyncHandler(async (req,res) => {
    try {
        const allCat = await Category.find();
        res.json(allCat);
    } catch (error) {
        throw new Error(error)
    }
})
const getSingleProductCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        const singleCat = await Category.findById(id);
        res.json(singleCat);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { 
    createProductCategory, 
    updateProductCategory, 
    delelteProductCategory ,
    getAllProductCategory,
    getSingleProductCategory
};