const octokit = require('@octokit/rest')();
const chalk = require('chalk');
const Promise = require('bluebird');
const nconf = require('nconf');
const os = require('os');
const git = require('simple-git/promise')();

const homedir = os.homedir();
nconf.file(homedir + '/.ghflow/config');

exports.mergeReleaseBranch = function(releaseBranch, sourceBranch) {
	return new Promise(function(resolve, reject){
		console.log(chalk.cyan(`Merging ${releaseBranch} into ${sourceBranch}...`));
		git.mergeFromTo(releaseBranch, sourceBranch).then(function(){
			resolve();
		});
	});
};

exports.createGitHubRelease = function(owner, repo, targetBranch, tagName, tagDescription) {
	return new Promise(function(resolve, reject){

		// token (https://github.com/settings/tokens)
		octokit.authenticate({
			type: 'token',
			token: nconf.get('githubToken')
		});

		console.log(chalk.cyan(`Creating tag ${tagName} for ${targetBranch} at repo: ${owner}/${repo}`));
		octokit.repos.createRelease({owner: owner, repo: repo, tag_name: tagName, target_commitish: targetBranch, name: tagDescription, body: tagDescription}).then(result => {
			resolve();
		})
	});
};