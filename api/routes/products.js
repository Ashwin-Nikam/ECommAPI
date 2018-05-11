const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product'); 

router.get('/', (req, res) => {
	Product.find()
	.exec()
	.then(products => {
		console.log(products);
		res.status(200).json(products);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
});

router.post('/', (req, res) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product
	.save()
	.then(result => {
		console.log(result);
		res.status(201).json({
			message: 'Handling POST requests to /products',
			createdProduct: product
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Product.findById(id)
	.exec()
	.then(product => {
		console.log(product);
		if(product)
			res.status(200).json(product);
		else
			res.status(404).json({message: 'No valid entry found for provided id'});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


router.patch('/:id', (req, res) => {
	res.status(200).json({
		message: 'Updated product'
	});
});


router.delete('/:id', (req, res) => {
	const id = req.params.id;
	Product.remove({_id: id})
	.exec()
	.then(result => {
		res.status(200).json(result);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
});

module.exports = router;