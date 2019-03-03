const keystone = require('keystone');

const Module = keystone.list('Module').model;
const Question = keystone.list('Question').model;
const Team = keystone.list('Team').model;
const Answer = keystone.list('Answer').model;

getAssignedModules = async (assignedModules) => {
    return await Module.find({'_id': assignedModules});
};

getModuleQuestions = async (moduleId) => {
    return await Question.find({module: moduleId}).sort({'name': 'asc'});
};

getUserAnswers = async (moduleId, userId) => {
    return await Answer.find({
            $and: [
                {moduleId: moduleId},
                {userId: userId}
            ]
        }
    ).sort({'updatedAt': 'desc'});
};

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    
    const locals = res.locals;
    locals.section = 'assessment';

    locals.path = "Test";
    locals.active = req.query.surveyIndex || 0;

    view.query('team', Team.findOne({'_id': req.user.team}));

    getAssignedModules(req.user.assignedModules).then((mods) => {
        Promise.all(mods.map(async (mod) => {
            const modId = mod._id;
            const questions = await getModuleQuestions(modId);
            const answers = await getUserAnswers(modId, req.user.id);
            
            return {
                id: modId,
                name: mod.name,
                questions: questions,
                answers: answers
            };
        })).then((modules) => {
            locals.modules = modules;
            view.render('assessment');
        });
    });

    view.on('post', async () => {
        console.log(req.body);
        const moduleId = req.body.moduleId;
        const prevAnswers = await getUserAnswers(moduleId, req.user.id);

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
                            console.log(err);
                        } else {
                            console.log('worked?');
                            console.log(docs);
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
                            console.log('failed');
                            console.log(err);
                        } else {
                            console.log('worked..?');
                        }
                    });
                }
            //}
        }

        return res.redirect('back');
    });
};