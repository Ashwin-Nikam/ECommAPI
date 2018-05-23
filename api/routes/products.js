const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

/*
	Some multer code to select destination where to 
	store files locally and what to name them.
*/

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname)
	}
});


/*
	To filter out certain files
*/
const fileFilter = (req, file, cb) => {
	// reject a file
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') 
		cb(null, true);
	else 
		cb(null, false);
};

const upload = multer({
	storage: storage, 
	limits: { fileSize: 1024* 1024 * 5 }, // Only accept upto 5MB files 
	fileFilter: fileFilter
});

const Product = require('../models/product'); 

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:id', ProductsController.products_get_product);

router.patch('/:id', checkAuth, ProductsController.products_update_product);

router.delete('/:id', checkAuth, ProductsController.products_delete);

module.exports = router;