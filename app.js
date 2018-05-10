const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./api/routes/products.js');

// Our own custom middleware
app.use('/products', productRoutes);

app.listen(port);
console.log('Running on port ' + port);