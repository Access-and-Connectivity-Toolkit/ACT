/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = (app) => {
	// API's
	app.post('/api/respond', middleware.requireUser, routes.api.respond.question);
	app.get('/api/export/csv', middleware.requireUser, routes.api.export.csv);
	
	// Views
	app.get('/', routes.views.index);
	app.all(['/assessment', '/assessment/:moduleId'], middleware.requireUser, routes.views.assessment);
	app.get('/about', routes.views.about);
	app.get('/resources', routes.views.resources);
	app.all('/team', middleware.requireUser, routes.views.team);
	app.get('/home', middleware.requireUser, routes.views.home);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
