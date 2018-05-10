const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

/*
This is the middleware
Routes which should handle requests
*/

app.use('/', (req, res) => {
	res.status(200)
		.send('Please use GET /products or GET /orders');
});
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(port);
console.log('Running on port ' + port);