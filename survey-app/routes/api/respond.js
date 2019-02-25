const keystone = require('keystone');

const Answer = keystone.list('Answer').model;
const ModuleProgress = keystone.list('ModuleProgress').model;

/**
 * handles responses to questions
 */
exports.question = async (req, res) => {
	
	if (req.query.isComplete && req.query.isComplete === 'true') {
		//TODO: update module progress to COMPLETE
		// console.log('===defined and true!');
	}
	
	//TODO: update module progress percentage based on request param 
	
	const moduleId = req.body.moduleId;
	const prevAnswers = await Answer.find({
			$and: [
				{moduleId: moduleId},
				{userId: req.user.id}
			]
		}
	).sort({'updatedAt': 'desc'});
	
	for (const question in req.body) {
		if (question == 'moduleId') continue;

		const answer = req.body[question];

		// Textareas can submit empty strings
		//if (answer) {
		let previous = prevAnswers.find(_ => _.questionId == question);

		if (previous && previous.answer !== req.body[question]) {
			const query = Answer.findOne({_id: previous._id});

			// findOneAndUpdate doesn't change updatedAt, so we're doing it manually...
			const updates = {
				answer: answer,
				updatedAt: Date.now()
			};

			Answer.findOneAndUpdate(query, updates, {new: true}, (err, docs) => {
				if (err) {
					console.error('error on find and update', err); //TODO: think about how we want to perform error handling
				}
			});
		} else {
			const newAnswer = new Answer({
				userId: req.user._id,
				questionId: question,
				moduleId: req.body.moduleId,
				answer: answer
			});

			newAnswer.save((err) => {
				if (err) {
					console.error('error on save', err);
				}
			});
		}
	}
	
	return res.sendStatus(200); 
}; 
