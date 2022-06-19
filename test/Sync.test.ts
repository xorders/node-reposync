import { Sync } from '../src';
import { TPackageJson } from '../src/Sync';

const isWin = process.platform === "win32";

const testPackageJson_normal: TPackageJson = {
	repos: {
		'repoName': {
			url: 'repoUrl',
		},
	},
};

const testPackageJson_existing: TPackageJson = {
	repos: {
		'repoNameExisting': {
			url: 'repoUrl',
		},
	},
};

const testPackageJson_noObject: TPackageJson = {
	repos: {
		'repoName': {}
	},
};

// Test Sync.defaultDryRunCommand() static fn:
test('defaultDryRunCommand', () => {
	expect(Sync.defaultDryRunCommand()).toBe(!isWin ? 'echo -n' : 'echo | set /p dummy=');
});

// Test Sync.getPackageJsonPath() static fn:
test('getPackageJsonPath', () => {
	expect(Sync.getPackageJsonPath('x')).toBe(!isWin ? 'x/package.json' : 'x\\package.json');
});

// Test Sync().doSync() fn:
test('doSync-normal', () => {
	expect(new Sync().doSync({ dryRun: true }, testPackageJson_normal)).toEqual([{
		name: 'repoName',
		code: 0,
		message: 'git clone repoUrl repoName',
	}]);
});

test('doSync-normal-existing', () => {
	expect(new Sync().doSync({ dryRun: true }, testPackageJson_existing)).toEqual([{
		name: 'repoNameExisting',
		code: 0,
		message: 'git fetch',
	}]);
});

test('doSync-notfound_exception', () => {
	expect(new Sync().doSync({ dryRun: true, dryRunCommand: 'ehco' }, testPackageJson_normal)).toEqual(
		expect.arrayContaining([expect.objectContaining({
			name: 'repoName',
			code: !isWin ? 127 : 1,
		})]));
});

test('doSync-no_object_result', () => {
	expect(new Sync().doSync({ dryRun: true }, testPackageJson_noObject)).toEqual(
		expect.arrayContaining([expect.objectContaining({
			name: 'repoName',
			code: -1,
			message: 'no object'
		})]));
});
