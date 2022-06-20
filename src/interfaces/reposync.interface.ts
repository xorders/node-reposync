export interface IReposyncOptions {
	dryRun?: boolean;
	dryRunCommand?: string;
}

export enum IResult {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE'
}

export interface IRepoResult {
	name: string;
	code: number;
	message?: string;
	result: IResult;
}

export type TRepoSyncResult = IRepoResult[];
