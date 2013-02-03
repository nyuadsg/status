var Project = require('../models/project');

exports.update = function(req, res){
	data = JSON.parse( req.body.payload );
	
	console.log( data );
	
	Project.findOneAndUpdate(
		{slug: req.params.slug},
		{
			update: new Date().getTime(),
			repository: data.repository.url
		},
		{upsert: true},
		function( err, project ) {
			console.log( project );
			if( err )
			{
				res.send( 'error' );
			}
			else
			{
				res.send( 'good' );
			}
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

exports.edit = function( req, res ) {
	res.send( req.user );
}