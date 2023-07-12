const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');


const createBlog = asyncHandler(async (req,res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)
    }
});

const updateBlog = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new : true });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)
    }
});

const getBlog = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try{
       const getblog = await Blog.findById(id).populate('likes').populate('dislikes');
       await Blog.findByIdAndUpdate(id, {
            $inc : { numViews : 1 }
        }, {new : true})
        res.json(getblog)
    } catch(error) {
        throw new Error(error)
    }
})

const getAllBlogs  = asyncHandler(async (req,res) => {
    try {
        const allBlogs = await Blog.find();
        res.json(allBlogs)
    } catch (error) {
        throw new Error(error)
    }

})

const likeBlog = asyncHandler(async (req,res) => {
    const { blogId } = req.body;

    const blog = await Blog.findById(blogId);
    const isLiked = blog?.isLiked;
    const loginUserId = req?.user._id;

    const alreadyDisliked = blog?.dislikes?.find( (userId) => userId.toString() === loginUserId );

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : { dislikes : loginUserId },
            isDisliked : false
        }, { new : true });
        res.json(blog);
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : { likes : loginUserId },
            isLiked : false
        }, { new : true });
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push : { likes : loginUserId },
            isLiked : true
        }, { new : true });
        res.json(blog);
    }
})
const disLikedBlog = asyncHandler(async (req,res) => {
    const { blogId } = req.body;

    const blog = await Blog.findById(blogId);
    const disLiked = blog?.isDisliked;
    const loginUserId = req?.user._id;

    const alreadyliked = blog?.likes?.find( (userId) => userId.toString() === loginUserId );

    if (alreadyliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : { likes : loginUserId },
            isLiked : false
        }, { new : true });
        res.json(blog);
    }

    if (disLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : { dislikes : loginUserId },
            isDisliked : false
        }, { new : true });
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push : { dislikes : loginUserId },
            isDisliked : true
        }, { new : true });
        res.json(blog);
    }
})

const deleteBlog = asyncHandler(async (req,res) => {
    const { id } = req.params;

    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog, disLikedBlog }