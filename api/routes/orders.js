const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		message: 'Orders were fetched'
	});
});

router.post('/', (req, res) => {
	res.status(201).json({
		message: 'Order was created'
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