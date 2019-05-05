const keystone = require('keystone');

const Team = keystone.list('Team').model;
const Users = keystone.list('User').model;
const Modules = keystone.list('Module').model;
const Roles = keystone.list('Role').model;

getTeamId = async (team) => {
    return await Team.findOne({'_id': team});
};

isTeamLeader = (team, userId) => {
    return team.leader.toString() === userId.toString();
};

getTeamMembers = async (team) => {
    return await Users.find({
        'team': team
    });
};

getModules = async () => {
    return await Modules.find();
};

createModuleMap = (modules) => {
    const modNames = {};

    for (let i = 0; i < modules.length; i++) {
        modNames[modules[i]._id] = modules[i].name;
    }

    return modNames;
};

updateUser = async (userId, roleId, modules) => {
    const query = {'_id': userId};
    const update = {'assignedModules': modules, 'role': roleId !== "no-role" ? roleId : null};
    Users.findOneAndUpdate(query, update, {new: true}, (err, mods) => {
        if (err) {
            console.error(err);
        }

        return mods;
    });
};

createRoleMap = async(roles) => {
    const roleNames = {};

    for (let i = 0; i < roles.length; i++) {
        roleNames[roles[i]._id] = roles[i].name;
    }

    return roleNames;
};

getRoles = async() => {
    return await Roles.find();
};

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'team';

    const modules = await getModules();
    const modMap = createModuleMap(modules);
    locals.modMap = modMap;

    const roles = await getRoles();
    const roleMap = await createRoleMap(roles);
    locals.roleMap = roleMap;
    view.on('post', async () => {
        if (!req.body.userId) {
            console.error("missing user");
            // TODO: in app error messages
        } else {
            const userId = req.body.userId;
            delete req.body.userId;
            let roleId = req.body.role;
            delete req.body.role;
            await updateUser(userId, roleId, Object.values(req.body));
        }
        res.redirect('back')
    });

    getTeamId(req.user.team).then(async (team) => {
        locals.team = team;
        locals.isLeader = isTeamLeader(team, req.user._id);
        locals.user = req.user;

        return await getTeamMembers(team, req.user._id);
    }).then((members) => {
        let newMembers = members;
        const membersToModules = {};

        for (let i = 0; i < members.length; i++) {
            // translate module and role ids into names for each user
            const assignedMods = members[i].assignedModules;
            const assignedMap = {};
            const modNames = [];

            for (let j = 0; j < assignedMods.length; j++) {
                modNames[j] = modMap[assignedMods[j]];
                assignedMap[assignedMods[j]] = true;
            }

            newMembers[i].modules = modNames;
            newMembers[i].roleName = roleMap[members[i].role];

            membersToModules[members[i].id] = assignedMap;
        }

        locals.members = members;
        locals.membersToModules = membersToModules;

        view.render('team');
    });
};
