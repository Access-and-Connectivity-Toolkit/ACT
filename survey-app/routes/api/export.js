const keystone = require('keystone');
const Answer = keystone.list('Answer').model;
const _ = require('lodash');
const stringify = require('csv-stringify');

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
			
			//filter out all answers where userId is equal to null, mongoose does not filter this out for us in the match statement
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
			
			if (flattenedAnswers.length === 0) {
				return res.status(200).send('no results'); 
			}
			
			res.setHeader('Content-Type', 'text/csv');
			//if the same person can be assigned multiple teams, file name + fields may have to change
			res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'bcatAnswers-' + Date.now() + '.csv\"');

			stringify(flattenedAnswers, { header: true })
				.pipe(res);
			
			return; 	
		})
		.catch(function(err) {
			console.log('err', err);
			return res.status(500).send(err); 
		});
	
}
