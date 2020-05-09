const keystone = require('keystone');
const _ = require('lodash');
const grabity = require('grabity');

const Module = keystone.list('Module').model;
const ModuleProgress = keystone.list('ModuleProgress').model;
const Question = keystone.list('Question').model;
const Team = keystone.list('Team').model;
const Answer = keystone.list('Answer').model;

getAssignedModules = async (assignedModules) => {
    return await Module.find({'_id': assignedModules}).sort({'rank': 'asc'});
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

getResourceLinkInfo = async(links) => {
    const results = [];
    for (let i = 0; i < links.length; i++) {
        const details = await grabity.grabIt(links[i]);
        details["link"] = links[i];
        results[i] = details;
    }
    
    return results;
};

getUserProgress = async (userId, moduleId) => {
    return await ModuleProgress.findOne({userId: userId, moduleId: moduleId});
};

exports = module.exports = async (req, res) => {
    const view = new keystone.View(req, res);
    
    const locals = res.locals;
    locals.section = 'assessment';
    locals.path = "Test";

    view.query('team', Team.findOne({'_id': req.user.team}));

    getAssignedModules(req.user.assignedModules).then(async (mods) => {
    	var activeId; 
    	
    	if (req.params.moduleId) {
            const modIds = mods.map(mod => mod._id.toString());
            if (modIds.includes(req.params.moduleId)) {
                activeId = req.params.moduleId;
            } else {
                throw new Error("Not Found");
            }
		} else if (mods.length > 0) {
			return res.redirect('/assessment/' + mods[0].id);
		}
		
        locals.active = activeId; 

		Promise.all(mods.map(async (mod) => {
            const modId = mod._id;
            const questions = await getModuleQuestions(modId);
            const answers = await getUserAnswers(modId, req.user.id);
            const userProgress = await getUserProgress(req.user.id, mod._id);
            
            let resources;
            if (mod.resources) {
                resources = await getResourceLinkInfo(mod.resources);
            }
            
            return {
                id: modId,
                name: mod.name,
                questions: questions,
                answers: answers,
                resources: resources,
                progress: userProgress.percentage.toFixed(1)
            };
        })).then((modules) => {
			let mappedModules = _.keyBy(modules, function(m) {
				return m.id;
			});
        	
            locals.modules = mappedModules;
			view.render('assessment');
        });
    }).catch((err) => {
        console.error(err);
        view.render('errors/404');
    });
};
