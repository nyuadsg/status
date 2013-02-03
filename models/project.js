// we need mongoose
var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	slug: String,
	update: Number,
	repository: String
});

projectSchema.virtual('status').get(function () {
	var now = new Date();
	var timeDiff = Math.abs(now.getTime() - this.update);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	
	if( diffDays > 35 )
	{
		return 'red';
	}
	else if( diffDays > 14 )
	{
		return 'yellow';
	}
	else
	{
		return 'green';
	}
});

var Project = module.exports = mongoose.model('Project', projectSchema);