const express = require('express');
const app = express();
const dbConnection = require('./config/dbConnection');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); 
const blogRoutes = require('./routes/blogRoutes'); 
const productCategoryRoutes = require('./routes/productCategoryRoutes'); 
const blogCategoryRoutes = require('./routes/blogCategoryRoutes'); 
const brandRoutes = require('./routes/brandRoutes'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
dbConnection();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser())
app.use(morgan())
app.use('/api/user', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/product-category', productCategoryRoutes);
app.use('/api/blog-category', blogCategoryRoutes);
app.use('/api/brand', brandRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} `)
})