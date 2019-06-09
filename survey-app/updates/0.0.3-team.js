const keystone = require('keystone');
const Team = keystone.list('Team');
const User = keystone.list('User').model;

// Add initial team so user team functionality works

const team = {
    'name': 'Jefferson County',
    'state': 'Washington',
    'leader': 'user@keystonejs.com',
    'county': 'Jefferson'
}

createTeam = async (team) => {
    const leader = await User.findOne({'email': team.leader});
    if (!leader) {
        console.log('Invalid team leader');
    } else {
        team.leader = leader._id.toString();
        const newTeam = new Team.model(team);
        await newTeam.save();
        leader.team = newTeam;
        User.update({_id: leader._id}, {$set: {"team": newTeam._id}}, (err, data) => {
            if (err) console.log(err);
        });
    }
}

exports = module.exports = async (done) => {
    await createTeam(team);
    done();
}