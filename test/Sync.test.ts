import { Sync } from '../src';
import { TPackageJson } from '../src/Sync';

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

// Test Sync.getPackageJsonPath() static fn:
test('getPackageJsonPath', () => {
	expect(Sync.getPackageJsonPath('x')).toBe('x/package.json');
});

// Test Sync.addTrailingSlash() static fn:
test('addTrailingSlash-var1', () => {
	expect(Sync.addTrailingSlash('x/')).toBe('x/');
});

test('addTrailingSlash-var2', () => {
	expect(Sync.addTrailingSlash('x')).toBe('x/');
});

// Test Sync.removeTrailingSlash() static fn:
test('removeTrailingSlash-var1', () => {
	expect(Sync.removeTrailingSlash('x/')).toBe('x');
});

test('removeTrailingSlash-var2', () => {
	expect(Sync.removeTrailingSlash('x')).toBe('x');
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
			code: 127,
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
