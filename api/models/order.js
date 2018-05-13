const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectOd,
	product: { type: mongoose.Schema.Types.ObjectOd, ref: 'Product', required: true },
	quantity: { type: Number, default: 1 }
});	

module.exports = mongoose.model('Order', orderSchema);