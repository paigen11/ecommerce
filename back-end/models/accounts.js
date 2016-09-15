var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	// tokenExpDate: Date,
	frequency: String,
	total: String
});

module.exports = mongoose.model('Account', accountSchema);