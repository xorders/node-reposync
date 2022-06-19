import { IPackageJson } from './interfaces/packageJson.interface';
import { IRepo, IReposJson } from './interfaces/reposJson.interface';
import { IReposyncOptions, TRepoSyncResult } from './interfaces/reposync.interface';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export type TPackageJson = IPackageJson | IReposJson;

export class Sync {
	rootDir: string;
	packageJson: TPackageJson;

	constructor(rootDir?: string) {
		const { main } = require;
		this.rootDir = rootDir ?? require('path').dirname(<string>main?.filename);
		this.packageJson = require(Sync.getPackageJsonPath(this.rootDir));
	}

	static getPackageJsonPath(rootDir: string) {
		return path.join(rootDir, 'package.json');
	}

	static directoryExists(path: string) {
		return fs.existsSync(path);
	}

	doSync(options: IReposyncOptions, packageJsonOverride?: TPackageJson): TRepoSyncResult {
		const repos = packageJsonOverride?.repos ?? this.packageJson?.repos;
		const result: TRepoSyncResult = [];

		for (const key of Object.keys(repos)) {
			const repoName = key;
			const repoObject = <IRepo>repos[key];

			if (repoObject?.url) {
				var cwd;
				const gitCommand = ['git'];
				if (options.dryRun) gitCommand.unshift(options.dryRunCommand ?? 'echo -n');
				const destinationRepoPath = path.join(this.rootDir, this.packageJson?.reposDir ?? '', repoName);

				if (!Sync.directoryExists(destinationRepoPath)) {
					gitCommand.push(`clone ${ repoObject.url }`);
					if (repoObject.branch) gitCommand.push(`--branch=${ repoObject.branch }`);
					if (repoObject.depth) gitCommand.push(`--depth=${ repoObject.depth }`);
					gitCommand.push(repoName);
					cwd = path.join(this.rootDir, this.packageJson?.reposDir ?? '');
				} else {
					gitCommand.push(`fetch`);
					cwd = destinationRepoPath;
				}

				const cmd = gitCommand.filter(f => !!f).join(' ');

				try {
					// Convert execSync buffer result to string and remove trailing linebreak
					const stdout = child_process.execSync(cmd, { cwd }).toString();
					result.push({
						name: repoName,
						code: 0,
						message: stdout,
					});
				} catch (error: any) {
					result.push({
						name: repoName,
						code: error?.status,
						message: `exec error=[${error?.message}] cwd=[${cwd}] cmd=[${cmd}]` ,
					});
				}
			} else {
				result.push({
					name: repoName,
					code: -1,
					message: 'no object',
				});
			}
		}

		return result;
	}
}
