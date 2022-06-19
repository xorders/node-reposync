export interface IReposyncOptions {
	dryRun?: boolean;
	dryRunCommand?: string;
}

export interface IRepoResult {
	name: string;
	code: number;
	message?: string;
}

export type TRepoSyncResult = IRepoResult[];
