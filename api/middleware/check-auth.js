/*
	This is the middleware to check that only get products 
	and get products with some id are unprotected and rest
	all routes are protected.
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);	
		req.userData = decoded;
		next();
	} catch(error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
};