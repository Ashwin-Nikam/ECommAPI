/*
	This is the middleware to check that only get products 
	and get products with some id are unprotected and rest
	all routes are protected.
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		console.log(token);
		const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);	
		req.userData = decoded;
		next();
	} catch(error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
};