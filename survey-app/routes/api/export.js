const keystone = require('keystone');
const Answer = keystone.list('Answer').model;

//can add other export types as needed
exports.csv = async (req, res) => {
	let teamId = req.query.teamId;
	
	const allAnswers = await Answer.find()
		.populate('moduleId')
		.populate({
			path: 'userId',
			password: 0,
			match: { team: teamId },
			populate: {
				path: 'role',
				model: 'Role'
			}
		})
		.populate('questionId', {name: 1, question: 1});

	var flattenedAnswers = []; 
	
	allAnswers.forEach(function(answer) {
		let flatAnswer = {}; 
		
		flatAnswer['name'] = answer['userId'].name['first'] + ' ' + answer['userId'].name['last'];
		flatAnswer['email'] = answer['userId'].email;
		flatAnswer['question'] = answer['questionId'].question;
		flatAnswer['questionName'] = answer['questionId'].name;
		flatAnswer['moduleName'] = answer['moduleId'].name;
		
		if (answer['userId'].role) {
			flatAnswer['role'] = answer['userId'].role['name'];
		}
		
		flattenedAnswers.push(flatAnswer); 
	});
	
	return res.json(flattenedAnswers); 
}
