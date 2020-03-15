const keystone = require('keystone');

const Users = keystone.list('User').model;
const Roles = keystone.list('Role').model;
const ModuleProgress = keystone.list('ModuleProgress').model;

const teamInfoHelper = require('../teamInfo');

updateUser = async (userId, roleId, modules) => {
    const query = {'_id': userId};
    const update = {'assignedModules': modules, 'role': roleId !== "no-role" ? roleId : null};
    Users.findOneAndUpdate(query, update, {new: true}, (err, mods) => {
        if (err) {
            console.error(err);
        }

        return mods;
    });
    
    modules.forEach(function(m) {
    	ModuleProgress.findOne({'moduleId': m, 'userId': userId}).then(function(progress) {
    		if (!progress) {
    			let userProgress = new ModuleProgress({
					userId: userId,
					moduleId: m,
					progress: 'NOT_STARTED', 
					percentage: 0
				});
    			userProgress.save((err) => {
    				if (err) {
    					console.log('could not save user progress. Error:', err);
					}
				}); 
			}
		})
	})
};

createUser = async(req, teamId) => {
    const newUser = new Users({
        name: {first: req.body.first, last: req.body.last},
        password: req.body.password,
        email: req.body.email,
        team: teamId,
        isAdmin: false
    });

    // TODO: error handling
    newUser.save((err) => {
        if (err) {
            console.error(err);
        } 
    });
}

createRoleMap = async() => {
    const roles = await Roles.find();

    const roleNames = {};

    for (let i = 0; i < roles.length; i++) {
        roleNames[roles[i]._id] = roles[i];
    }

    return roleNames;
};

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'team';

    view.on('post', async () => {
        if (!req.body.userId) {
            console.error("missing user");
            // TODO: in app error messages
            await createUser(req, req.user.team);
        } else {
            const userId = req.body.userId;
            delete req.body.userId;

            let roleId = req.body.role;
            delete req.body.role;

            await updateUser(userId, roleId, Object.values(req.body));
        }
        res.redirect('back');
    });

    const modMap = await teamInfoHelper.createModuleMap();
    locals.modMap = modMap;

    const roleMap = await createRoleMap();
    locals.roleMap = roleMap;

    teamInfoHelper.getTeamById(req.user.team).then(async (team) => {
        locals.team = team;
        locals.isLeader = teamInfoHelper.isTeamLeader(team, req.user._id);
        locals.user = req.user;

        return await teamInfoHelper.getTeamMembers(team._id);
    }).then(async (members) => {
        const memberInfo = await teamInfoHelper.formatTeamMemberInfo(members, modMap);

        locals.members = memberInfo.members;
        locals.membersToModules = memberInfo.membersToModules;
        locals.percentage = memberInfo.teamPercentage.toFixed(1);

        view.render('team');
    });
};
