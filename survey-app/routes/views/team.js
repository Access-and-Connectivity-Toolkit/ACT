var keystone = require('keystone');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'team';

    var Team = keystone.list('Team').model;
    view.query('team', Team.find({'_id': req.user.team}));

    var Users = keystone.list('User').model;
    view.query('members', Users.find({'team': req.user.team, '_id': {$ne: req.user._id}}));

    view.render('team');
};