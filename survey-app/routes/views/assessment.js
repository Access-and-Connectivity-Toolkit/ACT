var keystone = require('keystone');
exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'assessment';
    
    var ModulePath = keystone.list('ModulePath').model;
    view.query('path', ModulePath.find({'_id': req.user.assignedPath}));

    // Find all modules in this user's assigned path
    var Module = keystone.list('Module').model;
    view.query('modules', Module.find({'pathways': req.user.assignedPath}).sort({'index': 'asc'}));

    view.on('get', function(next) {
        locals.surveyIndex = req.query.surveyIndex;
        console.log(req.query);

        next();
    });

    view.render('assessment');
};