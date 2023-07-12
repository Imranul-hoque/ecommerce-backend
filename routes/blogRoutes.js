const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikedBlog } = require('../controller/blogCtrl');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');


route.put('/update/:id', updateBlog);
route.get('/get-blog/:id',  getBlog)
route.get('/all-blogs', getAllBlogs )
route.delete('/delete/:id', deleteBlog)
route.post('/create', authMiddleware, isAdmin,createBlog);
route.put('/likes', authMiddleware,isAdmin,likeBlog);
route.put('/dislikes', authMiddleware,isAdmin,disLikedBlog);

module.exports = route;