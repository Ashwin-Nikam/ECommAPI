const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		message: 'Handling GET requests to /products'
	});
});

router.post('/', (req, res) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	}
	res.status(201).json({
		message: 'Handling POST requests to /products',
		createdProduct: product
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	if(id === 'special') {
		res.status(200).json({
			message: 'You discovered a special id',
			id: id
		});
	} else {
		res.status(200).json({
			message: 'Normal id',
			id: id
		});
	}
});


router.patch('/:id', (req, res) => {
	res.status(200).json({
		message: 'Updated product'
	});
});


router.delete('/:id', (req, res) => {
	res.status(200).json({
		message: 'Deleted product'
	});
});

module.exports = router;