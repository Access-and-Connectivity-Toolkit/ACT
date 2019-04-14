const keystone = require('keystone');
const ObjectId = require('mongoose').Types.ObjectId; 

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

updateAssignedModules = async (userId, modules) => {
    const query = {'_id': userId};
    const update = {'assignedModules': modules};

    Users.findOneAndUpdate(query, update, {new: true}, (err, mods) => {
        if (err) {
            console.error(err);
        }
        
        return mods;
    });
};

// map roles to names
// TODO: does this make more sense to do up front?
createRoleMap = async(roles) => {
    const roleNames = {};

    for (let i = 0; i < roles.length; i++) {
        roleNames[roles[i]._id] = roles[i].name;
    }

    return roleNames;
};

// get all roles
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
    const roleMap = createRoleMap(roles);

    view.on('post', async () => {
        await updateAssignedModules(req.user._id, Object.values(req.body));
        res.redirect("");
    });

    getTeamId(req.user.team).then(async (team) => {
        locals.team = team;
        locals.isLeader = isTeamLeader(team, req.user._id);
        locals.user = req.user;

        return await getTeamMembers(team, req.user._id);
    }).then((members) => {
        let newMembers = members;

        for (let i = 0; i < members.length; i++) {
            // need to translate ids into names for each user
            let assignedMods = members[i].assignedModules;
            let modNames = [];
            for (let j = 0; j < assignedMods.length; j++) {
                modNames[j] = modMap[assignedMods[j]];
            }
            newMembers[i].modules = modNames;
            
            // for some reason this doesn't do anything -- members[i].role undefined
            newMembers[i].role = roleMap[members[i].role];
        }

        locals.members = newMembers;

        view.render('team');
    });
};