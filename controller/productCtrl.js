const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req,res) => {
    try {
        if (req.body?.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
    }
});

const getSingleProdut = asyncHandler( async (req,res) => {
    const { id } = req.params;

    try {
        const singleProduct = await Product.findById(id);
         res.json(singleProduct)
    } catch(error) {
        throw new Error(error)
    }
});

const getAllProduct = asyncHandler(async (req,res) => {
    
    try {


        // FILTERING DATA

        const queryObj = {...req.query}
        const excludeField = ['page','sort','limit','fields']
        excludeField.forEach(el => delete queryObj[el]);
        let queryString = JSON.stringify(queryObj);

        queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        let query = Product.find(JSON.parse(queryString));

        // SORTING DATA
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // SELECT DATA BY FIELDS

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields) 
        } else {
            query = query.select('__v');
        }


        // PAGINATION

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const pageCount = await Product.countDocuments()
            if (skip >=pageCount) throw new Error('Page is not exist');
        }

        
        const products = await query;
        res.json(products)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
        if (req.body?.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedData = await Product.findByIdAndUpdate(id, (req.body), { new : true })
        res.json(updatedData);
        
    } catch (error) {
        throw new Error(error)
    }
});

const addToList = asyncHandler(async (req,res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyadded) {
            const user = await User.findByIdAndUpdate(_id,{
                $pull : { wishlist : prodId }
            }, { new : true })

            res.json(user)
        } else {
            const user = await User.findByIdAndUpdate(_id,{
                $push : { wishlist : prodId }
            }, { new : true })
            res.json(user)
        }

    } catch(error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        const deletedData = await Product.findByIdAndDelete(id);
        res.json({ message : "product has been deleted" })
    } catch (error) {
        throw new Error(error)
    }
});

const rating = asyncHandler(async (req,res) => {
    const { _id } = req.user;
    const { prodId, star, comment } = req.body;

    try {
        const product = await Product.findById(prodId)
        const alreadyRated = product.ratings.find(
            (user) => user.postedBy.toString() === _id.toString()
        )
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings : { $elemMatch : alreadyRated }
                },
                {
                    $set : { 'ratings.$.star' : star, 'ratings.$.comment' : comment }
                },
                {
                    new : true
                }
            )
            res.json(updateRating)

        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId,
                {
                    $push : {
                        ratings : {
                            star : star,
                            comment : comment,
                            postedBy : _id
                        }
                    }
                },
                {
                    new : true
                }
                )
                res.json(rateProduct)
        }

        const getallratings = await Product.findById(prodId)
        const totalratings = getallratings.ratings.length;
        const ratingsum = getallratings.ratings.map(item => item.star).reduce((prev, curr) => prev + curr, 0);
        const actualratings = Math.round(ratingsum / totalratings);
        const finalRating = await Product.findByIdAndUpdate(prodId, {
            totalratings : actualratings
        },{new : true})
        res.json(finalRating)
        
    } catch (error) {
        throw new Error(error)
    }


})



module.exports = { 
    createProduct, 
    getSingleProdut, 
    getAllProduct, 
    updateProduct, 
    deleteProduct,
    addToList,
    rating 

};