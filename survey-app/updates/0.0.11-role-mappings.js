const keystone = require('keystone');
const Role = keystone.list('Role').model;
const Module = keystone.list('Module').model;

const fs = require('fs');

const FILE_PATH = 'modules/mappings.json';

const modMap = {};

const getMappingFile = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf-8', (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(result));
			}
		});
	});
};

const updateRoles = async (mappings) => {
    const roles = await Role.find();
    roles.forEach(async (role) => {
        const mapping = mappings[role.name];
        if (!mapping) {
            console.error('entry not found ' + role.name);
        } else {
            mapping.forEach((entry) => {
                role.modules.push(modMap[entry]);
            });
        }

        const query = Role.findOne({_id: role._id});

        const updates = {
            modules: role.modules
        };

        await Role.findOneAndUpdate(query, updates, {new: true}, (err, docs) => {
            if (err) {
                console.error(err);
            }
        });
    })
}

const createModuleMap = async () => {
    const modules = await Module.find({}, {name: 1, _id: 1});
    modules.forEach((mod) => {
        modMap[mod.name] = mod.id;
    });
};

exports = module.exports = async (done) => {
    await createModuleMap();
    const mappings = await getMappingFile(FILE_PATH);
    await updateRoles(mappings);
    done();
};