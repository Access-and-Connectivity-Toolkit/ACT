const keystone = require('keystone');

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Already signed in
	if (req.user) {
		return res.redirect('/home');
	}

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = '/';

	view.on('post', (next) => {
		if (!req.body.email || !req.body.password) {
			return next();
		}

		const onSuccess = () => {
			res.redirect('/home');
		}

		const onFail = () => {
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
