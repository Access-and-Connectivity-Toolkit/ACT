const keystone = require('keystone');

const Team = keystone.list('Team').model;
const Users = keystone.list('User').model;
const Modules = keystone.list('Module').model;

getTeamId = async (team) => {
    return await Team.findOne({'_id': team});
};

isTeamLeader = (team, userId) => {
    return team.leader.toString() === userId.toString();
};

getTeamMembers = async (team, userId) => {
    return await Users.find({
        'team': team,
        '_id' : userId
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

// This should probably be in an api route
updateAssignedModules = async (userId, modules) => {
    const query = {'_id': userId};
    const update = {'assignedModules': modules};
    Team.findOneAndUpdate(query, update, {new: true}, (err, mods) => {
        if (err) {
            console.error(err);
        }
        
        return mods;
    });
};

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'team';

    const modules = await getModules();
    const modMap = createModuleMap(modules);
    locals.modMap = modMap;

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
        }

        locals.members = newMembers;

        view.render('team');
    });
};