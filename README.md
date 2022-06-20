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

# Example

For this example you will need _nodejs_ and _NPM_ installed.

## 0. Install required tools

### Ubuntu

This will also install _nodejs_

```shell
sudo apt install -y npm
```

### Other OSes

Please refer to this link:

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## 1. package.json

Create `package.json` in root directory of your project.

```json
{
    "name": "your-distro",
    "version": "0.0.1",
    "description": "",
    "scripts": {
        "sources": "node sources.js"
    },
    "dependencies": {
        "node-reposync": "^0.0.3"
    },
    "reposDir": "sources",
    "repos": {
        "poky": {
            "url": "git://git.yoctoproject.org/poky",
            "branch": "kirkstone",
            "depth": 1
        },
        "meta-openembedded": {
            "url": "https://github.com/openembedded/meta-openembedded.git",
            "branch": "kirkstone",
            "depth": 1
        },
        "openembedded-core": {
            "url": "git://git.openembedded.org/openembedded-core",
            "branch": "kirkstone",
            "depth": 1
        }
    }
}
```

## 2. sources.js

Create `sources.js` in root directory of your project.

```javascript
var Reposync = require('node-reposync')

var sync = new Reposync.Sync()

console.log(sync.doSync({}));
```

## 3. Initialize NPM

Run in terminal from root directory of your project.

```shell
npm install
```

## 4. Run

Now you can run sources sync script.
It will `git clone` or `git fetch` into specified **rootDir**, depending on existence of repo directory.

```shell
npm run sources
```
