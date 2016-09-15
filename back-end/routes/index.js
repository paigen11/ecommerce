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
	Account.findOne(
		{username: req.body.username},
		function(error, document){
			if(document != null){
				res.json({name: 'nameTaken'});
			}else{
				if(req.body.password != req.body.password2){
					res.json({
						message: 'passmatch'
					});
				}else{
					var token = randToken(32);
					var date = Date.now();
					var tokenExpDate = date + (30 * 60 * 1000);
					var accountToAdd = new Account({
						username: req.body.username,
						password: bcrypt.hashSync(req.body.password),
						email: req.body.email,
						token: token,
						tokenExpDate: tokenExpDate, 
						frequency: '',
						total: '',
						fullName: '',
						address1: '',
						address2: '',
						city: '',
						state: '',
						zipCode: ''
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
			}
		})


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
				var date = Date.now();
				var tokenExpDate = date + (30);
				// var tokenExpDate = Date.now();
				if(loginResult){
					//the password is correct, log them in
					//update the token each time the user logs in
					Account.update({username: document.username},{token: token, tokenExpDate: tokenExpDate}).exec();
					res.json({
						success:'userFound',
						username: document.username,
						token: token,
						tokenExpDate: tokenExpDate
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

router.post('/logout', function(req, res, next){
	Account.findOne({username: req.body.username}).remove({token: req.body.token}).exec();
})

router.post('/options', function(req, res, next){
	Account.update(
		{token: req.body.token}, //this is the droid we're looking for
			{
			frequency: req.body.frequency,
			total: req.body.total
			}
		).exec();

		res.json({
			post: 'optionAdded'
		});
});

router.post('/delivery', function(req, res, next){
	Account.update({username: req.body.username},{
		fullName: req.body.fullName,
		address1: req.body.address1,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zipCode: req.body.zipCode
		}
	).exec();
		res.json({
		post: 'addressAdded'
	});
});

router.get('/payment', function(req, res, next){
	console.log($cookies.username);
	console.log('test');
	Account.findOne({
		username: $cookies.username
	},
	function(error, document){
		if(document != null){
			res.json({
				frequency: document.frequency,
				fullName: document.fullName,
				address1: document.address1,
				address2: document.address2,
				city: document.city,
				state: document.state,
				zipCode: document.zipCode
				// total: document.total
			})
		}

	})
})	

router.get('/getUserData', function(req, res, next){
	var userToken = req.query.token; //equal to the XXXXX in ?token=XXXXX
	// var tokenExpDate;
	// Account.findOne(
	// 	{tokenExpDate: tokenExpDate},
	// 	function(error, document){
	// 		tokenExpDate = document.tokenExpDate;
	// 	}
	// )
	// console.log(tokenExpDate);
	if(userToken == undefined){
		//no token was supplied
		res.json({failure: "noToken"});
	}else{
		Account.findOne(
			{token: userToken}, //this is the droid we're looking for
			function(error, document){
				// if(userToken >= tokenExpDate){
				// 	//this token is expired - time to login in again
				// 	res.json({failure: 'expiredToken'});
				// } else 
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
