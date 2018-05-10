const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

/*
This is the middleware
Routes which should handle requests
*/

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(port);
console.log('Running on port ' + port);