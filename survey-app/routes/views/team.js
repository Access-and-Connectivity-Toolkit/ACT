const keystone = require('keystone');

const Team = keystone.list('Team').model;
const Users = keystone.list('User').model;

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'team';

    view.query('team', Team.findOne({'_id': req.user.team}));

    view.query('members', Users.find({
        'team': req.user.team, 
        '_id': {$ne: req.user._id}
    }));

    view.render('team');
};