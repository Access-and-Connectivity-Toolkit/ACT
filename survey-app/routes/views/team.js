const keystone = require('keystone');

const Users = keystone.list('User').model;
const Roles = keystone.list('Role').model;
const ModuleProgress = keystone.list('ModuleProgress').model;

const teamInfoHelper = require('../teamInfo');

updateUser = async (user) => {
	const userId = user.userId;
	let roleId = user.role;
	
	const query = {'_id': userId};
	
	const update = {};
	if (user.first || user.last) {
	    update.name = {};
        if (user.first) {
            update.name.first = user.first;
        }
        if (user.last) {
            update.name.last = user.last;
        }
	}
	
	if (user.email) {
	    update.email = user.email;
	}
	
	if (user.affiliation) {
		update.affiliation = user.affiliation;
	}
	
	if (roleId) {
	    update.role = roleId !== "no-role" ? roleId : null;
	}

    if (user.modules) {
        update.assignedModules = user.modules;

        user.modules.forEach(function (m) {
            ModuleProgress.findOne({'moduleId': m, 'userId': userId}).then(function (progress) {
                if (!progress) {
                    let userProgress = new ModuleProgress({
                        userId: userId,
                        moduleId: m,
                        progress: 'NOT_STARTED',
                        percentage: 0
                    });
                    userProgress.save((err) => {
                        if (err) {
                            console.error('could not save user progress. Error:', err);
                        }
                    });
                }
            })
        });
    }

    Users.findOneAndUpdate(query, update, {new: true}, (err, updatedUser) => {
        if (err) {
            console.error(err);
        } else {
            if (user.password && user.confirm && user.password === user.confirm) {
                // TODO: display error if password + confirm doens't match
                updatedUser.password = user.password;
                //explicitly call save to encrypt password before storing
                updatedUser.save((err) => {
                    if (err) {
                        console.error('could not update user password. Error:', err);
                    }
                });
            }
        }

        return updatedUser;
    });

};

createUser = async(req, teamId) => {
    const newUser = new Users({
        name: {first: req.body.first, last: req.body.last},
        password: req.body.password,
        email: req.body.email,
        team: teamId, 
        affiliation: req.body.affiliation,
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
            await updateUser(req.body);
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

        view.render('team');
    });
};
