const keystone = require('keystone');

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'team';

    const Team = keystone.list('Team').model;
    view.query('team', Team.find({'_id': req.user.team}));

    const Users = keystone.list('User').model;
    view.query('members', Users.find({'team': req.user.team, '_id': {$ne: req.user._id}}));

    view.render('team');
};