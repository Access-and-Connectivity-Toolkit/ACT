const keystone = require('keystone');
const User = keystone.list('User').model;

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = '/';

	// Render the view
	view.render('index');
};
