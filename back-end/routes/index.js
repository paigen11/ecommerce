var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/ecommerce';
var Account = require('../models/accounts');
mongoose.connect(mongoUrl);
// include bcrypt to store hashed pass
var bcrypt = require('bcrypt-nodejs');

router.post('/register', function(req, res, next){

	if(req.body.password != req.body.password2){
		res.json({
			message: 'passmatch'
		});
	}else{
		var accountToAdd = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			email: req.body.email
		});

		accountToAdd.save();
		res.json({
			message: 'added',
			username: req.body.username
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
				//reun comparesync. first param is the english password, second param is the hash. 
				//they will return true if equal, false if not
				var loginResult = bcrypt.compareSync(req.body.password, document.password);
				if(loginResult){
					//the password is correct, log them in
					res.json({
						success:'userFound'
					});
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

module.exports = router;
