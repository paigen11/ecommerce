var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/ecommerce';
var Account = require('../models/accounts');
mongoose.connect(mongoUrl);
// include bcrypt to store hashed pass
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token').uid;

router.post('/register', function(req, res, next){

	if(req.body.password != req.body.password2){
		res.json({
			message: 'passmatch'
		});
	}else{
		var token = randToken(32);
		var tokenExpDate = Date.now()
		var accountToAdd = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			email: req.body.email,
			token: token,
			// tokenExpDate: 
			frequency: 'empty',
			total: 'empty'
			
		});

		accountToAdd.save(function(error, documentAdded){
			if(error){
				res.json({
					message: 'errorAdding'
				})
			}else{
				res.json({
					message: 'added',
					username: req.body.username,
					token: token
				});
			}
		});
	}
})

router.post('/login', function(req, res, next){
	Account.findOne(
		{username: req.body.username}, //this is the droid we're looking for
		function(error, document){
			//document is the document returned from our Mongo query... ie. the droid
			//the document will have a property for each field. we need to check the password
			//in the database against the hashed bcrypt version
			if(document == null){
				//no match
				res.json({failure: 'noUser'});
			}else{
				//run comparesync. first param is the english password, second param is the hash. 
				//they will return true if equal, false if not

				var loginResult = bcrypt.compareSync(req.body.password, document.password);
				var token = randToken(32);
				// var tokenExpDate = Date.now();
				if(loginResult){
					//the password is correct, log them in
					//update the token each time the user logs in
					Account.update({username: document.username},{token: token}).exec();
					res.json({
						success:'userFound',
						username: document.username,
						token: token
					});
					console.log(token);
				}else{
					//hashes did not match or the doc wasn't found. goodbye
					res.json({
						failure: 'badPassword'
					});
				}
			}
		}
	)
});

router.post('/options', function(req, res, next){
	// console.log(req.body.frequency);
	// console.log(req.body.total);
	// console.log(req.body.token);
	Account.update(
		{token: req.body.token}, //this is the droid we're looking for
			{
			frequency: req.body.frequency,
			total: req.body.total
			}
		).exec();

		res.json({
			post: 'optionAdded'
			// frequency: document.frequency,
			// total: document.total
		});
});	

router.get('/getUserData', function(req, res, next){
	var userToken = req.query.token; //equal to the XXXXX in ?token=XXXXX
	if(userToken == undefined){
		//no token was supplied
		res.json({failure: "noToken"});
	}else{
		Account.findOne(
			{token: userToken}, //this is the droid we're looking for
			function(error, document){
				if(document == null){
					//this token is not in the system
					res.json({failure: 'badToken'}); //Angular will need to act on this information ie. send them to the login page
				}else{
					res.json({
						username: document.username,
						frequency: document.frequency,
						total: document.total,
						token: document.token
					});
				}
			}
		)
	}
});

module.exports = router;
