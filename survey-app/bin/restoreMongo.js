#!/usr/bin/env node

const restore = require('mongodb-restore');

restore({
	uri: process.env.MONGODB_URI,
	root: __dirname,
	tar: 'mongo-backup.tar',
});
