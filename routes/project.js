var Project = require('../models/project');

exports.update = function(req, res){
	Project.findOneAndUpdate(
		{slug: req.params.slug},
		{update: new Date().getTime()},
		{upsert: true},
		function( err, project ) {
			res.send(project.slug);
		}
	);
};