const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');


router.get('/', (req, res) => {
	Order.find()
	.select('product quantity _id')
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
	const order = new Order({
		_id: mongoose.Types.ObjectId(),
		quantity: req.body.quantity,
		product: req.body.productId
	});
	order
	.save()
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
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.get('/:id', (req, res) => {
	res.status(200).json({
		message: 'Order details',
		orderId: req.params.id
	});
});

router.delete('/:id', (req, res) => {
	res.status(200).json({
		message: 'Order was deleted',
		orderId: req.params.id
	});
});

module.exports = router;