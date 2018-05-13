const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
	Order.find()
	.select('product quantity _id')
	.populate('product', 'name') // Use this to show required the data of the product
	.exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' + doc._id
					}
				}
			})
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

router.post('/', (req, res) => {
	/*
		First we check if the product with the 
		productId mentioned is already there in
		the database.
	*/
	Product.findById(req.body.productId)
	.then(product => {
		if(!product) {
			return res.status(404).json({
				message: 'Product not found'
			});
		}
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		});
		return order.save();
	})
	.then(result => {
		res.status(201).json({
			message: 'Order stored',
			createdOrder: {
				_id: result._id,
				product: result.product,
				quantity: result.quantity
			},
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders/' + result._id
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			message: 'Product not found',
			error: err
		});
	});
});

router.get('/:id', (req, res) => {
	Order.findById(req.params.id)
	.exec()
	.then(order => {
		if(!order) {
			return res.status(404).json({
				message: 'Order not found'
			});
		}
		res.status(200).json({
			order: order,
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders'
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:id', (req, res) => {
	Order.remove({ _id: req.params.id })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders',
				body: { productId: 'ID', quantity: 'Number'}
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;