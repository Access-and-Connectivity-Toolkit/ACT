#!/usr/bin/env node

const restore = require('mongodb-restore');

restore({
	uri: process.env.MONGO_URI,
	root: __dirname,
	tar: 'mongo-backup.tar',
});
