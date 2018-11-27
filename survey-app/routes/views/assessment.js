const keystone = require('keystone');

const ModulePath = keystone.list('ModulePath').model;
const Module = keystone.list('Module').model;
const Team = keystone.list('Team').model;

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    
    const locals = res.locals;
    locals.section = 'assessment';
    
    view.query('path', ModulePath.findOne({'_id': req.user.assignedPath}));

    // Find all modules in this user's assigned path
    view.query('modules', Module.find({'pathways': req.user.assignedPath}).sort({'index': 'asc'}));

    view.query('team', Team.findOne({'_id': req.user.team}));

    view.render('assessment');
};