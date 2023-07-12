const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');

const createBrandCategory = asyncHandler(async (req,res) => {
    try{
        const newCategory = await Brand.create(req.body);
        res.json(newCategory);
    } catch(error) {
        throw new Error(error)
    }
});

const updateBrandCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const updateCategory = await Brand.findByIdAndUpdate(id, req.body, { new : true })
       res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
});


const delelteBrandCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
       const deletecategory = await Brand.findByIdAndDelete(id)
       res.json(deletecategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllBrandCategory = asyncHandler(async (req,res) => {
    try {
        const allCat = await Brand.find();
        res.json(allCat);
    } catch (error) {
        throw new Error(error)
    }
})
const getSingleBrandCategory = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        const singleCat = await Brand.findById(id);
        res.json(singleCat);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { 
    createBrandCategory, 
    updateBrandCategory, 
    delelteBrandCategory ,
    getAllBrandCategory,
    getSingleBrandCategory
};