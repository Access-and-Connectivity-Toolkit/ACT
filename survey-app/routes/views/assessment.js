var keystone = require('keystone');
exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'assessment';

    // Find all modules in this user's assigned path
    var Module = keystone.list('Module').model;
    view.query('modules', Module.find({'pathways': req.user.assignedPath}).sort({'index': 'asc'}));

    view.render('assessment');
};