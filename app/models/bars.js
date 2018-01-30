'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    barId: String,
	name: String,
	imgUrl: String,
	going: Number,
	url: String,
	comment: String
});

module.exports = mongoose.model('Bar', Bar);
