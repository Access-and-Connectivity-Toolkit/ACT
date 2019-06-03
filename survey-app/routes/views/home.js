const keystone = require('keystone');

const teamInfoHelper = require('../teamInfo');

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'home';

    if (!req.user.team) {
        console.log('no team');
    }
    
    const modMap = await teamInfoHelper.createModuleMap();
    locals.modMap = modMap;

    teamInfoHelper.getTeamById(req.user.team).then(async (team) => {
        locals.team = team;
        locals.user = req.user;

        return await teamInfoHelper.getTeamMembers(team._id);
    }).then(async (members) => {
        const memberInfo = await teamInfoHelper.formatTeamMemberInfo(members, modMap);

        locals.members = memberInfo.members;
        locals.membersToModules = memberInfo.membersToModules;

        view.render('home');
    });
};