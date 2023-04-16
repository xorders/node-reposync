#!/usr/bin/env node

/**
 * This is the entry point for the reposync command line tool.
 */

import { Sync } from '../Sync';
import { IReposyncOptions } from '../interfaces/reposync.interface';
const sync = new Sync();

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') ) {
	console.log(`
Usage: reposync [options]
Options:

	--dry-run, -d
		Do not actually run any commands, just print them to the console.
	--dry-run-command <command>
		Override the command that is run when --dry-run is specified.
`);
}

// Parse options
const options: IReposyncOptions = {
	dryRun: args.includes('--dry-run') || args.includes('-d'),
	dryRunCommand: args.includes('--dry-run-command') ? args[args.indexOf('--dry-run-command') + 1] : undefined,
};

console.log(sync.doSync(options));
