var keystone = require('keystone');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'resources';

    var Resource = keystone.list('Resource').model;
    view.query('resources', Resource.find());

    view.render('resources');
};