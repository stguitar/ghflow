#!/usr/bin/env node --harmony
'use strict';
const program = require('commander');
const chalk = require('chalk');
const utilities = require('./utilities');
const createRelease = require('./create-release');

utilities.checkConfigFile().then(function() {

	program
		.option('-e, --email [emailAddress]', 'Email Address for Notification')
		.option('-s, --source [sourceBranch]', 'Source Branch')
		.option('-q, --quiet', 'Suppress Email')
		.parse(process.argv);

	var releaseBranch = program.args[0];

	if (!releaseBranch) {
		console.error(chalk.red('No release branch provided!'));
		process.exit(1);
	}

	var sourceBranch = program.source;
	if (!sourceBranch || typeof sourceBranch !== 'string') {
		sourceBranch = 'dev';
	}

	console.log('Creating ' + releaseBranch + ' off of ' + sourceBranch);

	utilities.checkRepoStatus().then(function (currentBranch) {
		createRelease.createAndPushReleaseBranch(releaseBranch, sourceBranch, currentBranch).then(function () {
			if (!program.quiet) {
				utilities.sendEmail();
			}
		});
	}).catch(function () {
		process.exit(1);
	});
});