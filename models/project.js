// we need mongoose
var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    slug: String,
	update: Number
});

var Project = module.exports = mongoose.model('Project', projectSchema);