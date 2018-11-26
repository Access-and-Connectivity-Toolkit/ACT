var keystone = require('keystone');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    var Team = keystone.list('Team').model;
    view.query('teams', Team.find());

    view.render('join');
};