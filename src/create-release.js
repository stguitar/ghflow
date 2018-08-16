const git = require('simple-git/promise')();
const chalk = require('chalk');
const Promise = require('bluebird');

exports.createAndPushReleaseBranch = function(releaseBranch, sourceBranch, originalBranch) {
	return new Promise(function(resolve, reject){

		git.checkoutBranch(releaseBranch, sourceBranch).then(function(){
			console.log(chalk.green('Successfully Created ' + releaseBranch + ' from ' + sourceBranch + '...'));
			git.push('origin', releaseBranch).then(function(){
				console.log(chalk.green(releaseBranch + ' has been pushed!'));
				git.checkout(originalBranch).then(function(){
					console.log(chalk.magenta('Checking out ' + originalBranch));
					resolve();
				});
			});
		});

	});
};