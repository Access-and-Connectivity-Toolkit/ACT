const keystone = require('keystone');
const Answer = keystone.list('Answer').model;
const _ = require('lodash'); 

//can add other export types as needed
exports.csv = async (req, res) => {
	let teamId = req.query.teamId;
	Answer.find()
		.populate('moduleId')
		.populate({
			path: 'userId',
			password: 0,
			match: {
				team: teamId
			},
			populate: {
				path: 'role',
				model: 'Role'
			}
		})
		.populate('questionId', {name: 1, question: 1})
		.then(function(allAnswers) {
			var flattenedAnswers = [];
			
			//filter out all answers where userId is equal to null
			const filteredAnswers = _.filter(allAnswers, answer => answer.userId != null);

			filteredAnswers.forEach(function(answer) {
				let flatAnswer = {};

				flatAnswer['name'] = answer['userId'].name['first'] + ' ' + answer['userId'].name['last'];
				flatAnswer['email'] = answer['userId'].email;
				flatAnswer['question'] = answer['questionId'].question;
				flatAnswer['questionName'] = answer['questionId'].name;
				flatAnswer['moduleName'] = answer['moduleId'].name;

				if (answer['userId'].role) {
					flatAnswer['role'] = answer['userId'].role['name'];
				}

				flatAnswer['answers'] = answer['answer'];
				flattenedAnswers.push(flatAnswer);
			});

			return res.json(flattenedAnswers);
		})
		.catch(function(err) {
			console.log('err', err);
			return res.status(500).send(err); 
		});
	
}
