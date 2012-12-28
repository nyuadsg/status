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

exports.list = function(req, res){
	Project.find({}, function(error, projects){
		res.render("status", {
			title: "RDC Projects",
			projects: projects
		});
  });
};