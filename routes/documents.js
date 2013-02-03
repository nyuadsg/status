var GitHubApi = require("github");
var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});
github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
});

exports.index = function( req, res ) {
	var pages = [
		{
			url: process.env.BASE_URL + '/documents/contribute',
			title: 'Contribute to the Research & Development Committee'
		},
		{
			url: process.env.BASE_URL + '/projects',
			title: 'View all projects'
		}
	]
	res.render("index", {
		title: "Research & Development Committee",
		pages: pages
	});
}

exports.view = function( req, res ) {
	github.repos.getContent({
		user: 'nyuadsg',
		repo: 'rdc',
		path: 'docs/' + req.params.slug + '.md'
	}, function( err, data) {
		var contents = new Buffer(data.content, 'base64');
		contents = contents.toString();
		
		var parsed = contents.replace( 'access: public\n---' , '');
		if( parsed == contents ){
			res.render("error", {
				title: 'Authorization Error',
				error: 'You are not authorized to view that.'
			});
		} else {
			github.markdown.render( {text: parsed}, function( err, html ) {
				res.render("document", {
					title: req.params.slug,
					content: html.data
				});
			});
		}
	});
}