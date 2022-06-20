export interface IReposyncOptions {
	dryRun?: boolean;
	dryRunCommand?: string;
}

export enum ITaskStatus {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	WORKING = 'WORKING',
}

export interface IRepoResult {
	name: string;
	code: number;
	message?: string;
	status: ITaskStatus;
}

export type TRepoSyncResult = IRepoResult[];
