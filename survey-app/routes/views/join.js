const keystone = require('keystone');

const Team = keystone.list('Team').model;

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    view.query('teams', Team.find());

    view.render('join');
};