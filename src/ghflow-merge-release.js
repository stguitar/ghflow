#!/usr/bin/env node --harmony
'use strict';
const prompt = require('prompt');
const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');
const utilities = require('./utilities');
const mergeRelease = require('./merge-release');
const nconf = require('nconf');

utilities.checkConfigFile().then(function() {

	program
		.option('-e, --email [emailAddress]', 'Email Address for Notification')
		.option('-t, --tagtarget [tagTarget]', 'Target Branch for GitHub Tag')
		.option('-d, --devbranch [devBranch]', 'Development Branch')
		.option('-v, --version [version]', 'Version of code being tagged')
		.option('-q, --quiet', 'Suppress Email')
		.parse(process.argv);

	var releaseBranch = program.args[0];
	var version = program.version;

	if (!releaseBranch) {
		console.error(chalk.red('No release branch provided!'));
		process.exit(1);
	}

	var tagTarget = program.tagtarget;
	if (!tagTarget || typeof tagTarget !== 'string') {
		tagTarget = 'master';
	}

	var devBranch = program.devbranch;
	if (!devBranch || typeof devBranch !== 'string') {
		devBranch = 'dev';
	}

	const formatStrings = nconf.get('tagNameFormat') + ' ' + nconf.get('tagDescriptionFormat');
	const needsVersionData = formatStrings.indexOf('%version%') !== -1;
	if (needsVersionData && (!version || typeof version !== 'string')) {
		prompt.message = '';
		prompt.start();
		prompt.get({
			properties: {
				version: {
					description: chalk.yellow("Release Version")
				}
			}
		}, function (err, result) {
			if(err || result === undefined) {
				console.log('');
				process.exit(1);
			}
			version = result.version;
			performWorkflow(version, releaseBranch, tagTarget, devBranch);
		});
	} else {
		performWorkflow(version, releaseBranch, tagTarget, devBranch);
	}
});

function performWorkflow(version, releaseBranch, tagTarget, devBranch) {
	utilities.checkRepoStatus().then(function (currentBranch) {
		console.log(chalk.magenta('You are currently on the ' + currentBranch + ' branch'));
		utilities.getRepositoryOwnerAndName().then(function (repoData) {
			const date = moment().format('dddd, MMMM Do YYYY');
			const tagNameFormat = nconf.get('tagNameFormat') || '';
			const tagDescriptionFormat = nconf.get('tagDescriptionFormat') || '';
			const tagName = tagNameFormat.replace('%version%', version).replace('%releaseBranch%', releaseBranch);
			const tagDescription = tagDescriptionFormat.replace('%version%', version).replace('%date%', date);

			mergeRelease.mergeReleaseBranch(releaseBranch, devBranch).then(function () {
				mergeRelease.mergeReleaseBranch(releaseBranch, tagTarget).then(function () {
					mergeRelease.createGitHubRelease(repoData.owner, repoData.name, tagTarget, tagName, tagDescription).then(function () {
						console.log(chalk.green('Process Complete'));
						if (!program.quiet) {
							utilities.sendEmail();
						}
					});
				});
			});

		});
	}).catch(function () {
		process.exit(1);
	});
}