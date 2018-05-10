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

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error); // Throws the error to the next block
});

/*
	Catches errors from previous block (if initial route
	isn't correct) as well as errors coming from 
	elsewhere.
*/
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

app.listen(port);
console.log('Running on port ' + port);