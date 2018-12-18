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
}

getUserAnswers = async (moduleId, userId) => {
    console.log(moduleId);
    console.log(userId);

    return await Answer.find(
        {$and: [
            {moduleId: moduleId},
            {userId: userId}
        ]}
    );
}

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
            
            return {
                id: modId,
                name: mod.name,
                questions: questions
            };
        })).then((modules) => {
            locals.modules = modules;
            view.render('assessment');
        });
    });
    // getModuleId('Test').then((id) => {
    //     moduleId = id;
    //     view.query('questions', Question.find({module: moduleId}).sort({'name': 'asc'}));
    // }).then(() => getUserAnswers(moduleId, req.user._id)).then((userAnswers) => {
    //     console.log(userAnswers);
    // }).then(()=> {
    //     view.render('assessment');
    // });

    view.on('post', async () => {
        console.log(req.body);

        for (const question in req.body) {
            if (question == 'moduleId') continue;

            const answer = req.body[question];
            console.log(question);
            // Need to handle editing answers...

            // Textareas can submit empty strings
            if (answer) {
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
        }

        return res.redirect('back');
    });
};