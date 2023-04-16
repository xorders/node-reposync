export interface IRepo {
	url: string;
	branch?: string;
	depth?: number;
}

export interface IReposMap {
	[repoName: string]: IRepo;
}

export interface IConfig {
	reposync: {
		repos: IReposMap;
		dir: string;
	}
}
