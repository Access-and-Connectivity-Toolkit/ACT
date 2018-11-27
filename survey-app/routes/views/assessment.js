const keystone = require('keystone');

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'assessment';
    
    const ModulePath = keystone.list('ModulePath').model;
    view.query('path', ModulePath.find({'_id': req.user.assignedPath}));

    // Find all modules in this user's assigned path
    const Module = keystone.list('Module').model;
    view.query('modules', Module.find({'pathways': req.user.assignedPath}).sort({'index': 'asc'}));

    const Team = keystone.list('Team').model;
    view.query('team', Team.find({'_id': req.user.team}));

    view.render('assessment');
};