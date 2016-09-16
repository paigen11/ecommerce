var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	frequency: String,
	total: Number,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zipCode: String
});

module.exports = mongoose.model('Account', accountSchema);