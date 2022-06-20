# node-reposync

Helper NPM package for syncing base project with multiple repos


[![Test](https://github.com/xoros-repo/node-reposync/actions/workflows/test.yml/badge.svg)](https://github.com/xoros-repo/node-reposync/actions/workflows/test.yml)
[![Release & Publish](https://github.com/xoros-repo/node-reposync/actions/workflows/publish.yml/badge.svg)](https://github.com/xoros-repo/node-reposync/actions/workflows/publish.yml)

This nodejs module was created to substitute `repo` tool required to download and update multiple repositories while working with Yocto-based projects.

It also allows to use nodejs `package.json` to manage build scripts for your Yocto-based project. 

# Usage

## package.json for parent project

Minimal `package.json`

```json
{
	"repos": {
		"meta-openembedded": {
			"url": "https://github.com/openembedded/meta-openembedded.git"
		}
	}
}
```

Practical `package.json`

```json
{
	"repos": {
		"meta-openembedded": {
			"url": "https://github.com/openembedded/meta-openembedded.git",
            "branch": "kirkstone",
            "depth": 1
		}
	},
	"repoDir": "sources"
}
```

## Invocation from parent project

Javascript: 
```javascript
var Reposync = require('node-reposync')

var sync = new Reposync.Sync()

console.log(sync.doSync({}));
```

Typescript:
```typescript
import { Sync } from 'node-reposync';

new Sync().doSync({})
```
