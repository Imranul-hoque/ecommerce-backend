const BlogCategory = require('../models/blogCategoryModel');
const asyncHandler = require('express-async-handler');

const createBlogCategory = asyncHandler(async (req,res) => {
    try{
        const newCategory = await BlogCategory.create(req.body);
        res.json(newCategory);
    } catch(error) {
        throw new Error(error)
    }
});

const updateBlogCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new : true })
       res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
});


const delelteBlogCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const deletecategory = await BlogCategory.findByIdAndDelete(id)
       res.json(deletecategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllBlogCategory = asyncHandler(async (req,res) => {
    try {
        const allCat = await BlogCategory.find();
        res.json(allCat);
    } catch (error) {
        throw new Error(error)
    }
})
const getSingleBlogCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        const singleCat = await BlogCategory.findById(id);
        res.json(singleCat);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { 
    createBlogCategory, 
    updateBlogCategory, 
    delelteBlogCategory ,
    getAllBlogCategory,
    getSingleBlogCategory
};