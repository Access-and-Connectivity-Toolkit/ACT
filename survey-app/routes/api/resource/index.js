var keystone = require('keystone');

var Resource = keystone.list('Resource').model;

var handlers = {
    getResources: function(req, res) {
        Resource.find().exec(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('DB Error');
            }

            res.status(200).send(data);
        });
    }
}

module.exports = handlers;