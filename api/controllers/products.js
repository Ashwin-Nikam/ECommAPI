const mongoose = require('mongoose');
const Product = require('../models/product'); 

exports.products_get_all = (req, res, next) => {
	Product.find()
	.select('name price _id productImage') // Now this isn't necessary 
	.exec()
	.then(products => {
		const response = {
			count: products.length,
			products: products.map(doc => {
				return {
					name: doc.name,
					price: doc.price,
					productImage: doc.productImage,
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
}

exports.products_create_product = (req, res, next) => {
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
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
}

exports.products_get_product = (req, res, next) => {
	const id = req.params.id;
	Product.findById(id)
	.select('name price _id productImage')
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
}

exports.products_update_product = (req, res, next) => {
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
}

exports.products_delete = (req, res, next) => {
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
}