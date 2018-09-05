const git = require('simple-git/promise')();
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = require('fs');
const os = require('os');
const nconf = require('nconf');
const homedir = os.homedir();
const prompt = require('prompt');


exports.checkRepoStatus = function() {
	return new Promise(function(resolve, reject){
		git.checkIsRepo().then(function(isRepo) {
			if(!isRepo) {
				console.error(chalk.red('This project is not a GIT repository'));
				process.exit(1);
			} else {
				git.status().then(function(status) {
					if (status.staged.length > 0 || status.modified.length > 0 || status.files.length > 0) {
						console.log('Staged: ' + status.staged.length);
						console.log('Modified Files: ' + status.modified.length);
						console.log('Files: ' + status.files.length);
						console.log(chalk.yellow('This project has pending changes. Release not created.'));
						reject();
					} else {
						resolve(status.current);
					}
				});
			}
		});
	});
};

exports.getRepositoryOwnerAndName = function() {
	return new Promise(function(resolve, reject){
		git.raw(['config','--get', 'remote.origin.url']).then(function(data){
			const repoData = (data.replace('.git\n', '').split(':')[1]).split('/');
			resolve({owner: repoData[0], name: repoData[1]})
		});
	});
};

exports.sendEmail = function() {
	console.log('Sending Email...');
};

exports.checkConfigFile = function() {
	return new Promise(function(resolve, reject) {
		if(!fs.existsSync(homedir + '/.ghflow/config')) {
			displayIntroMessage();
			promptForConfigFile().then(function(result){
				nconf.file(homedir + '/.ghflow/config');
				console.log(chalk.green('Configuration file (~/.ghflow/config) generated and loaded!\n'));
				resolve();
			})
		} else {
			nconf.file(homedir + '/.ghflow/config');
			resolve();
		}
	});
};

exports.runInitProcess = function() {
	return promptForConfigFile();
};

function promptForConfigFile() {
	return new Promise(function(resolve, reject){
		prompt.message = '';
		prompt.start();
		prompt.get({
			properties: {
				token: {
					description: chalk.magenta("GitHub Authentication Token")
				}
			}
		}, function(err, result){
			if(err || result === undefined) {
				console.log('');
				process.exit(1);
			}
			if(!fs.existsSync(homedir + '/.ghflow')) {
				fs.mkdirSync(homedir + '/.ghflow');
			}
			const fileData = {githubToken: result.token,
				tagNameFormat: 'rel_%version%_%releaseBranch%',
				tagDescriptionFormat: 'Release %version% for %date%'};
			fs.writeFileSync(homedir + '/.ghflow/config', JSON.stringify(fileData,null,'\t') + '\n');
			resolve(result);
		});
	})
}

function displayIntroMessage() {
	console.log(chalk.magenta('*******************************************************************************'));
	console.log(chalk.magenta('**  GitHub GitFlow Helper                                                    **'));
	console.log(chalk.magenta('*******************************************************************************'));
	console.log(chalk.magenta('**                                                                           **'));
	console.log(chalk.magenta('**') + '  This utility follows common practices of git-flow branch management,     ' + chalk.magenta('**'));
	console.log(chalk.magenta('**') + '  and creates relases in GitHub based on your master/trunk branch.         ' + chalk.magenta('**'));
	console.log(chalk.magenta('**                                                                           **'));
	console.log(chalk.magenta('**') + '  To do this, a configuration file (~/.ghflow/config) is used to hold your ' + chalk.magenta('**'));
	console.log(chalk.magenta('**') + '  person GitHub authentication token (https://github.com/settings/tokens). ' + chalk.magenta('**'));
	console.log(chalk.magenta('**                                                                           **'));
	console.log(chalk.magenta('*******************************************************************************'));
}