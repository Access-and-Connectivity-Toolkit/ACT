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
};

// Setup Route Bindings
exports = module.exports = (app) => {
	// Views
	app.all('/', routes.views.index);
	app.all('/join', routes.views.join);
	app.all('/signup', routes.views.signup);
	app.get('/assessment', middleware.requireUser, routes.views.assessment);
	app.all('/about', middleware.requireUser, routes.views.about);
	app.get('/team', middleware.requireUser, routes.views.team);
	app.get('/resources', middleware.requireUser, routes.views.resources);
	app.get('/home', middleware.requireUser, routes.views.home);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
