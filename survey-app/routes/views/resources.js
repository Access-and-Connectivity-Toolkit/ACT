const keystone = require('keystone');

const Resource = keystone.list('Resource').model;

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'resources';

    view.query('resources', Resource.find());

    view.render('resources');
};