const keystone = require('keystone');
const ModuleProgress = keystone.list('ModuleProgress').model;
const teamInfoHelper = require('../teamInfo');

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'home';
    
    const modMap = await teamInfoHelper.createModuleMap();
    locals.modMap = modMap;
    
    teamInfoHelper.getTeamById(req.user.team).then(async (team) => {
        locals.team = team;
        locals.user = req.user;
        
        let modules = await Promise.all(req.user.assignedModules.map(async (m) => {
			let progress = await ModuleProgress.findOne({'moduleId': m, 'userId': req.user}).populate('moduleId');
			return progress;
        }));
        
        const completed = (modules.filter((mod) => mod.progress == 'COMPLETE')).length;
        const total = modules.length;
        const percentage = completed * 100.0 / total;
        
        locals.percentage = percentage.toFixed(1);
        
        locals.assignedModules = modules;
        return view.render('home');
    });
};
