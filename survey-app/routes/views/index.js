const keystone = require('keystone');
const User = keystone.list('User').model;

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
			const query = User.findOne({email: req.body.email});
			const updates = {
				lastLogin: Date.now()
			};

			User.findOneAndUpdate(query, updates, (err) => {
				if (err) {
					console.error('error on find and update', err);
				}
			});

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
