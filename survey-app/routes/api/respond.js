const keystone = require('keystone');

const Answer = keystone.list('Answer').model;
const Question = keystone.list('Question').model;
const ModuleProgress = keystone.list('ModuleProgress').model;

/**
 * handles responses to questions
 */
exports.question = async (req, res) => {
	const moduleId = req.body.moduleId;
	const prevAnswers = await Answer.find({
			$and: [
				{moduleId: moduleId},
				{userId: req.user.id}
			]
		}
	).sort({'updatedAt': 'desc'});

	let answersLength = 0;
	for (const question in req.body) {
		if (question == 'moduleId') continue;

		const answer = req.body[question];
		// Textareas can submit empty strings, and we will assume empty Textareas are not completed answers
		if (!answer) continue;
		// once we've filtered out all the answers that aren't actually user responses (moduleId, empty text), up the answered q's length
		answersLength++;

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
	await updateModuleProgress(moduleId, req.user.id, answersLength, req.query.isComplete);
	return res.sendStatus(200);
};

async function updateModuleProgress(moduleId, userId, answersLength, isComplete) {
	let progress = 'IN_PROGRESS';
	// todo: go over the default of 100% progress if there isn't a  
	let percentage = 100.0;
	let updatedAt = Date.now();
	if (isComplete && isComplete === 'true') {
		progress = 'COMPLETE';
	} else {
		let moduleTotal = await Question.find({module: moduleId});
		percentage = (answersLength / moduleTotal.length) * 100.0;
	}

	let currentProgress = {progress, percentage, updatedAt};
	 ModuleProgress.findOneAndUpdate({
		$and: [
			{moduleId: moduleId},
			{userId: userId}
		]
	}, currentProgress, {new: true, upsert: true}, (err, docs) => {
	 	if (err) {
	 		console.error("error on find and update with module progress", err); //TODO: think about how we want to perform error handling
		}
	 })

}
