import { IPackageJson } from './interfaces/packageJson.interface';
import { IRepo, IReposJson } from './interfaces/reposJson.interface';
import { IReposyncOptions, ITaskStatus, TRepoSyncResult } from './interfaces/reposync.interface';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export type TPackageJson = IPackageJson | IReposJson;

export class Sync {
	rootDir: string;
	packageJson: TPackageJson;

	constructor(rootDir?: string) {
		this.rootDir = rootDir ?? process.cwd();
		this.packageJson = require(Sync.getPackageJsonPath(this.rootDir));
	}

	static getPackageJsonPath(rootDir: string) {
		return path.join(rootDir, 'package.json');
	}

	static directoryExists(path: string) {
		return fs.existsSync(path);
	}

	static makeCommandDryRun(
		command: string,
		options: { enable: boolean; override?: string } = { enable: false },
	): string {
		if (!options.enable) return command;
		if (options.override) return `${options.override} ${command}`;
		return process.platform === 'win32' ? `echo | set /p dummy= "${command}"` : `printf "${command}"`;
	}

	doSync(options: IReposyncOptions, packageJsonOverride?: TPackageJson): TRepoSyncResult {
		const repos = packageJsonOverride?.repos ?? this.packageJson?.repos;
		const result: TRepoSyncResult = [];

		for (const key of Object.keys(repos)) {
			const repoName = key;
			const repoObject = <IRepo>repos[key];

			if (repoObject?.url) {
				let cwd;
				const gitCommand = ['git'];
				const reposDir = path.join(this.rootDir, this.packageJson?.reposDir ?? '');

				if (!Sync.directoryExists(reposDir)) fs.mkdirSync(reposDir, { recursive: true });

				const destinationRepoPath = path.join(reposDir, repoName);

				if (!Sync.directoryExists(destinationRepoPath)) {
					gitCommand.push(`clone ${repoObject.url}`);
					if (repoObject.branch) gitCommand.push(`--branch=${repoObject.branch}`);
					if (repoObject.depth) gitCommand.push(`--depth=${repoObject.depth}`);
					gitCommand.push(repoName);
					cwd = reposDir;
				} else {
					gitCommand.push(`fetch`);
					cwd = destinationRepoPath;
				}

				const cmd = gitCommand.filter((f) => !!f).join(' ');

				try {
					// Convert execSync buffer result to string and remove trailing linebreak
					const stdout = child_process
						.execSync(
							Sync.makeCommandDryRun(cmd, { enable: options.dryRun ?? false, override: options.dryRunCommand }),
							{ cwd },
						)
						.toString();

					result.push({
						name: repoName,
						code: 0,
						message: stdout,
						status: ITaskStatus.SUCCESS,
					});
				} catch (error: any) {
					result.push({
						name: repoName,
						code: error?.status ?? -1,
						message: `exec error=[${error?.message}] cwd=[${cwd}] cmd=[${cmd}]`,
						status: ITaskStatus.FAILURE,
					});
				}
			} else {
				result.push({
					name: repoName,
					code: -1,
					message: 'Configuration error: url is missing',
					status: ITaskStatus.FAILURE,
				});
			}
		}

		return result;
	}
}
