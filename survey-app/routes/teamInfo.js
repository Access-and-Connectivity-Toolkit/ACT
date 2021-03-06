const keystone = require('keystone');
const User = keystone.list('User').model;
const Modules = keystone.list('Module').model;
const ObjectId = require('mongoose').Types.ObjectId;
const Team = keystone.list('Team').model;
const ModuleProgress = keystone.list('ModuleProgress').model;

exports.getTeamMembers = async(teamId) => {

    // Module list populate doesn't want to cooperate...
    return User.find({'team': teamId})
        .select({'password': 0, 'isAdmin': 0, 'team': 0})
        .populate({
            path: 'role',
            select: 'name'
        })
        .populate({
            path:'assignedModules.name'
        })
        .then((result) => {
            return result;
        });
};

exports.createModuleMap = async () => {
    modules = await Modules.find();

    const modNames = {};

    for (let i = 0; i < modules.length; i++) {
        modNames[modules[i]._id] = modules[i].name;
    }

    return modNames;
};

getNumModulesCompleted = async(teamMembers) => {
    const completed = await ModuleProgress.aggregate(
        {$match: {'userId': {"$in": teamMembers}, 'progress': 'COMPLETE'}},
        {$group: {_id: '$userId', count: {$sum: 1}}});

    return reformatProgressResults(completed);
};

reformatProgressResults = (results) => {
    const res = {};
    for (let i = 0; i < results.length; i++) {
        res[results[i]._id] = results[i].count;
    }
    return res;
};

exports.formatTeamMemberInfo = async(members, modMap) => {
    const membersToModules = {};

    const memberIds = members.map(_ => ObjectId(_.id));
    const memberCompleted = await getNumModulesCompleted(memberIds);

    let teamAssigned = 0;
    let teamCompleted = 0;

    for (let i = 0; i < members.length; i++) {
        // translate module and role ids into names for each user
        const assignedMods = members[i].assignedModules;
        const assignedMap = {};
        const modNames = [];

        for (let j = 0; j < assignedMods.length; j++) {
            modNames[j] = modMap[assignedMods[j]];
            assignedMap[assignedMods[j]] = true;
        }
        members[i].modules = modNames;
        if (members[i].role) {
            members[i].roleName = members[i].role.name;
        }

        if (modNames) {
            members[i].assigned = modNames.length;
            teamAssigned += modNames.length;
        }

        const completed = memberCompleted[members[i]._id];
        if (completed) {
            members[i].completed = completed;
            teamCompleted += completed;
        }

        membersToModules[members[i].id] = assignedMap;
    }

    const teamPercentage = teamCompleted * 100.0 / teamAssigned;

    return {members: members, membersToModules: membersToModules, teamPercentage: teamPercentage};
};

exports.getTeamById = async (teamId) => {
    if (teamId) {
        return await Team.findOne({'_id': teamId});
    }
};

exports.isTeamLeader = (team, userId) => {
    return team.leader.toString() === userId.toString();
};