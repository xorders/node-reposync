import { Sync } from '../src';
import { TPackageJson } from '../src/Sync';

const isWin = process.platform === 'win32';

const testPackageJson_normal: TPackageJson = {
	reposync: {
		repos: {
			repoName: {
				url: 'repoUrl',
			},
		},
	},
};

const testPackageJson_existing: TPackageJson = {
	reposync: {
		repos: {
			repoNameExisting: {
				url: 'repoUrl',
			},
		},
		dir: 'testDir',
	},
};

const testPackageJson_noObject: TPackageJson = {
	reposync: {
		repos: {
			repoName: {},
		},
	},
};

describe('makeCommandDryRun', () => {
	test('disabled', () => {
		expect(Sync.makeCommandDryRun('', { enable: false })).toBe('');
	});

	test('enabled, no override', () => {
		expect(Sync.makeCommandDryRun('command_to_dry_run', { enable: true })).toBe(
			!isWin ? 'printf "command_to_dry_run"' : 'echo | set /p dummy= "command_to_dry_run"',
		);
	});

	test('enabled, with override', () => {
		expect(Sync.makeCommandDryRun('command_to_dry_run', { enable: true, override: 'dry_run_override' })).toBe(
			'dry_run_override command_to_dry_run',
		);
	});
});

// Test Sync.getPackageJsonPath() static fn:
test('getPackageJsonPath', () => {
	expect(Sync.getPackageJsonPath('x')).toBe(!isWin ? 'x/package.json' : 'x\\package.json');
});

describe('doSync', () => {
	test('normal', () => {
		expect(new Sync().doSync({ dryRun: true }, testPackageJson_normal)).toEqual([
			{
				name: 'repoName',
				code: 0,
				message: 'git clone repoUrl repoName',
				status: 'SUCCESS',
			},
		]);
	});

	test('normal, existing', () => {
		expect(new Sync(process.cwd() + '/test/').doSync({ dryRun: true }, testPackageJson_existing)).toEqual([
			{
				name: 'repoNameExisting',
				code: 0,
				message: 'git fetch',
				status: 'SUCCESS',
			},
		]);
	});

	test('notfound exception', () => {
		expect(new Sync().doSync({ dryRun: true, dryRunCommand: 'ehco' }, testPackageJson_normal)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'repoName',
					code: !isWin ? 127 : 1,
					status: 'FAILURE',
				}),
			]),
		);
	});

	test('no object result', () => {
		expect(new Sync().doSync({ dryRun: true }, testPackageJson_noObject)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'repoName',
					code: -1,
					message: 'Configuration error: url is missing',
					status: 'FAILURE',
				}),
			]),
		);
	});
});
