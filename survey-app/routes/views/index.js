var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Already signed in
	if (req.user) {
		return res.redirect('/home');
	}

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = '/';

	view.on('post', function(next) {
		if (!req.body.email || !req.body.password) {
			return next();
		}

		var onSuccess = function() {
			res.redirect('/home');
		}

		var onFail = function() {
			return next();
		}

		keystone.session.signin({
			email: req.body.email, 
			password: req.body.password
		}, req, res, onSuccess, onFail);
		
	});

	// Render the view
	view.render('index');
};
