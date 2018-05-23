const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
	/*
		Check if email already signed up
	*/
	User.find({email: req.body.email}).exec()
	.then(user => {
		if(user.length >= 1) return res.status(409).json({message: 'email exists'});
		else {
			/*
				2nd parameter is number of salting rounds which hashing the password
			*/
			password: bcrypt.hash(req.body.password, 10, (err, hash) => {
				if(err) {
					console.log(err);
					return res.status(500).json({error: err});
				}
				else {
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash			
					});
					user.save()
					.then(result => {
						res.status(201).json({
							message: 'User created'
						});
					})
					.catch(err => {
						res.status(500).json({error: err});
					})
				}
			});
		}
	})
}

exports.user_login = (req, res, next) => {
	User.find({email: req.body.email})
	.exec()
	.then(user => {
		if(user.length < 1) return res.status(401).json({message: 'Auth failed'});
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if(err) return res.status(401).json({message: 'Auth failed'});
			if(result) { 
				const token = jwt.sign({
					email: user[0].email,
					userId: user[0]._id
				}, 
				process.env.JWT_KEY, // This variable is in nodemon.json 
				{ expiresIn: "1h" }); // Access token expires in 1 hour

				return res.status(200).json({
					message: 'Auth successful',
					token: token
				});	
			} 
			res.status(401).json({message: 'Auth failed'});
		});
	})
	.catch(err => {
		res.status(500).json({error: err});
	});
}

exports.user_delete = (req, res, next) => {
	User.remove({_id: req.params.id})
	.exec()
	.then(result => {
		res.status(200).json({message: 'User deleted'});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}