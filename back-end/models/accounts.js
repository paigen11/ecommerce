var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	frequency: String,
	total: String,
	fullName: {type: String, required: true},
	address1: {type: String, required: true},
	address2: String,
	city: {type: String, required: true},
	state: {type: String, required: true},
	zipCode: {type: String, required: true}
});

module.exports = mongoose.model('Account', accountSchema);