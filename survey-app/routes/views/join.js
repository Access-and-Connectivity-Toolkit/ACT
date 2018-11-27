const keystone = require('keystone');

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    const Team = keystone.list('Team').model;
    view.query('teams', Team.find());

    view.render('join');
};