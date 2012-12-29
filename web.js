// load dependencies
var express = require('express')
	, http = require('http')
	, path = require('path');
var project = require('./routes/project');
var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

// prepare database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// schema for users
	var Project = require('./models/project');
});

// start app server
var app = express();

// configure express
app.configure(function(){
	app.set('port', process.env.PORT || 5000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser( process.env.SECRET ));
	app.use(express.session({ key: 'status.sess', secret: process.env.SECRET }));
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
});

// --- development
app.configure('development', function(){
	app.use(express.errorHandler());
});

// all routes
app.get('/', project.list);
app.get('/projects', project.list);
app.post('/project/:slug/update', project.update);

// oauth
passport.use('nyu-passport', new OAuth2Strategy({
	authorizationURL: 'http://localhost:9080/visa/oauth/authorize',
	tokenURL: 'http://localhost:9080/visa/oauth/token',
	clientID: 'abc123',
	clientSecret: 'ssh-secret',
	callbackURL: process.env.BASE_URL + '/auth/provider/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		console.log( accessToken, profile );
	}
)); // zMMFz4HuUtxJu6i24ZQ4gp6PDp8kQ5IN6b2LNHzZ3nQ115rEH9jkZryqZvQyfzZlFWsjXAD7JHrG0p81O9Xg38QxVfRY7jUHc1YMdiCGsfERSXGCFJsatiPEnxXt7qfluVWN4Pdc9OsxqNplKq8PdebyD8eZOL7K2g3vVu3Oc64Mkr6pzTs0VmnqjTOJNgVBugoOPTKZDyzjZ8wMr6i3IlCeTUNUzTNEEs1TIwktAruXPAXAQsrrUpLD0GzdZg4e

// google auth
app.get('/auth/provider', passport.authenticate('nyu-passport'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/provider/callback', 
	passport.authenticate('nyu-passport', { successRedirect: '/', failureRedirect: '/login' }));

// start listening
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});