const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const utilities = require('./utilities');

const homedir = os.homedir();

if (fs.existsSync(homedir + '/.ghflow/config')) {
	displayHelpMessage();
} else {
	utilities.runInitProcess().then(function(){
		console.log(chalk.green('Success!  Now run following the common usage!'));
		displayHelpMessage();
	});
}

function displayHelpMessage() {
	console.log('\n  Usage: ghflow [options] [command]\n');
	console.log('  Options:\n');
	console.log('    -h, --help                         output usage information\n');
	console.log('  Commands:\n');
	console.log('    create-release|cr [releaseBranch]  Create a new release branch');
	console.log('    merge-release|mr [releaseBranch]   Merge a release branch');
	console.log('    help [cmd]');
	console.log('');
}




