#!/usr/bin/env node

const backup = require('mongodb-backup');
const fs = require('fs');

const BoxSDK = require('box-node-sdk');

// Create new Box SDK instance
const sdk = new BoxSDK({
	clientID: process.env.BOX_CLIENT_ID,
	clientSecret: process.env.BOX_CLIENT_SECRET,
	
});

// Create new basic client with developer token
const client = sdk.getBasicClient(process.env.BOX_DEV_TOKEN);
const folderId = '58640691930';

async function runBackup() {
	await backup({
		 
		uri: process.env.MONGO_URI,
		root: __dirname + "/", // write files into this dir
		tar: 'dump-me.tar',
		callback: function(err) {
			if (err) {
				throw err
			} else {
				console.log('successfully backed up to ' + __dirname + 'dump-me.tar');
			}
		}
	});
}

function uploadBackup() {
	// Set upload values
	let filePath = __dirname + '/dump-me.tar';
	let fileName = 'mongo-backup.tar';

	// Create file upload stream
	const stream = fs.createReadStream(filePath);

	// Upload file
	return client.files.uploadFile(
		folderId,
		fileName,
		stream,
		function(err, res) {
			if (err) {
				throw err
			} else {
				console.log("successful upload");
			}
		}
	);
}


async function getBackupIds() {
	let ids = {};
	await client.folders.getItems(folderId, {}, function(err, res){
		if (err) {
			console.log("error", err);
			ids.error = err
		} else {
			// console.log("response", res);
			res.entries.forEach(function(file){
				console.log("ENTRIES!!!!!", file.id);
				if (file.name === "mongo-backup.tar") {
					ids.currentBackup = file.id;
				} else if (file.name === "mongo-backup-backup.tar") {
					ids.previousBackup = file.id;
				} else {
					console.log("inconsequential: ", file.name)
				}
			});
			// console.log("IDS", ids);
		}
	});
	// console.log("IDS!!!!!!!!!!!!!!!!!!!", ids);
	return ids
}

async function moveAroundOldData() {
	let hope = await getBackupIds(); 
	if (hope.error) {
		console.log("there was an error getting ids", hope.error);
		throw hope.error
	}
	// if everything went swimmingly, delete old backup
	// console.log("backup", hope);
	if (hope.previousBackup) {
		console.log("deleting previous backup");
		await client.files.delete(hope.previousBackup, function(err){
			if (err) {
				console.log("oh newwwwww", err);
				throw err;
			}
		});
	}
	// move "current" backup to previous backup 
	if (hope.currentBackup) {
		console.log("moving mongo-backup to mongo-backup-backup");
		await client.files.update(hope.currentBackup, {name: "mongo-backup-backup.tar"}
		).then((resp) => {
			console.log("updated", resp.id, resp.name)
		}).catch(err => {
			console.log("error occurred!", err);
			throw err;
		})
	}
}

if (module === require.main) {
	// create new mongo backup tar 
	runBackup().then(() => {
		// copy mongo-backup.tar to mongo-backup-backup.tar, delete old mongo-backup-backup
		moveAroundOldData().then(() => {
			// upload new mongo-backup.tar
			uploadBackup().catch(err => {
				console.error("unable to upload new backup", err)
			})
		}).catch(err => {
			console.error("unable to remove old backup: ", err)
		});
	}).catch(err => {
		console.error("unable to create backup: ", err)
	})
	
}

