const keystone = require('keystone');
const ModuleProgress = keystone.list('ModuleProgress').model;
const teamInfoHelper = require('../teamInfo');

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'home';

    if (!req.user.team) {
        console.log('no team');
        return view.render('home');
    }
    
    const modMap = await teamInfoHelper.createModuleMap();
    locals.modMap = modMap;
    
    teamInfoHelper.getTeamById(req.user.team).then(async (team) => {
        locals.team = team;
        locals.user = req.user;
        
        let modules = await Promise.all(req.user.assignedModules.map(async (m) => {
			let progress = await ModuleProgress.findOne({'moduleId': m, 'userId': req.user}).populate('moduleId');
			return progress;
		}));
        
        console.log('inside of team info helpers', modules);
        
		locals.assignedModules = modules;
        return await teamInfoHelper.getTeamMembers(team._id);
    }).then(async (members) => {
        const memberInfo = await teamInfoHelper.formatTeamMemberInfo(members, modMap);

        locals.members = memberInfo.members;
        locals.membersToModules = memberInfo.membersToModules;
        

        return view.render('home');
    });
};
