const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

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

router.get('/', (req, res) => {
	Product.find()
	.select('name price _id') // Now this isn't necessary 
	.exec()
	.then(products => {
		const response = {
			count: products.length,
			products: products.map(doc => {
				return {
					name: doc.name,
					price: doc.price,
					_id: doc._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
					}
				}
			})
		};
		res.status(200).json(response);
	})
	.catch(err => {
		res.status(500).json({error: err});
	});
});

router.post('/', upload.single('productImage'), (req, res) => {
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product
	.save()
	.then(result => {
		res.status(201).json({
			message: 'Created product successfully',
			createdProduct: {
				name: result.name,
				price: result.price,
				_id: result._id,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + result._id
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Product.findById(id)
	.select('name price _id')
	.exec()
	.then(product => {
		if(product) {
			res.status(200).json({
				product: product,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products'
				}
			});
		} else
			res.status(404).json({message: 'No valid entry found for provided id'});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});


router.patch('/:id', (req, res) => {
	const id = req.params.id;
	/*
		This is done to update either name or price
		or both
	*/
	const updateOps = {};
	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.update({_id: id}, {$set: updateOps})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Product is updated',
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/' + id
			}
		});
	})
	.catch(err => {
		res.status(500).json({error: err});
	})
});


router.delete('/:id', (req, res) => {
	const id = req.params.id;
	Product.remove({_id: id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Product is deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/products/',
				body: { name: 'String', price: 'Number'}
			}
		});
	})
	.catch(err => {
		res.status(500).json({error: err});
	});
});

module.exports = router;