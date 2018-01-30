'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Goer = new Schema({
    barId: String,
	goers: []
});

module.exports = mongoose.model('Goer', Goer);
