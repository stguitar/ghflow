#!/usr/bin/env node --harmony
'use strict';
const program = require('commander');


program
	.command('create-release [releaseBranch]', 'Create a new release branch').alias('cr')
	.command('merge-release [releaseBranch]', 'Merge a release branch').alias('mr')
	.command('init', 'Setup default config file', {isDefault: true, noHelp: true})
	.parse(process.argv);

