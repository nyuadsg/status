// load dependencies
var express = require('express')
	, http = require('http')
	, path = require('path');
var project = require('./routes/project')
	, documents = require('./routes/documents');
var passport = require('passport')
  , NYUPassportStrategy = require('passport-nyu').Strategy;

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
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
});

// --- development
app.configure('development', function(){
	app.use(express.errorHandler());
});

// all routes
app.get('/', documents.index);
app.get('/projects', project.list);
// app.get('/projects/edit', project.edit);
app.post('/project/:slug/update', project.update);
app.get('/document/:slug', documents.view)

// authentication with passport
passport.serializeUser(function(user, done) {
	done(null, user.token);
});

passport.deserializeUser(function(token, done) {
	done(null, token);
});

// oauth
passport.use('nyu-passport', new NYUPassportStrategy({
	clientID: process.env.PASSPORT_ID,
	clientSecret: process.env.PASSPORT_SECRET,
	callbackURL: process.env.BASE_URL + '/auth/provider/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		console.log( profile );
		user = {
			token: accessToken,
			netID: profile.netID
		}
		done(null, user);
	}
));

// google auth
app.get('/auth/provider', passport.authenticate('nyu-passport'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/provider/callback', 
	passport.authenticate('nyu-passport', { successRedirect: '/', failureRedirect: '/auth/provider' }));

// start listening
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});