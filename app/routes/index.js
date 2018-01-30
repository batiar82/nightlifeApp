'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var BarHandler = require(path + '/app/controllers/barHandler.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/auth/github');
		}
	}

	var clickHandler = new ClickHandler();
	var barHandler = new BarHandler();
	app.route('/')
		.get(function (req, res) {
			console.log("Session en index "+JSON.stringify(req.session));
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	/*
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
*/
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	/*
	app.route('/auth/github/callback')
		.get(function(req,res,next){
			console.log("Me llama github para authenticate");
			passport.authenticate('github', function(err,user,info){
				if (err) { return next(err); }
				if (!user) { return res.redirect('/login'); }
				console.log("authenticado");
				req.logIn(user,function(err){
					if(err) { return next(err);}
					console.log("regreso "+req.session.lastSearch);
					res.json(user);
				});
				
			}
		)});
*/
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
	
	app.route('/api/getBars/:city')
		.get(barHandler.getBars);

	app.route('/api/setGoing')
		.post(barHandler.setGoing);
	
	app.route('/api/isAuthenticated')
		.get(function (req, res) {
			console.log("Llaman a isAuthenticated "+req.isAuthenticated());
			res.json(req.isAuthenticated());
		});
	app.route('/api/getLastSearch')
		.get(function (req, res) {
			console.log("Llaman a getLastSearch y encuentro "+req.session.lastSearch);
			var lastSearch=req.session.lastSearch;
			if(lastSearch !=undefined)
				res.json(lastSearch);
			else
				res.json(false);
		});
	app.route('/api/testBars')
		.get(barHandler.testBars);	
};

