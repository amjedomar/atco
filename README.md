# Atco
The tool that provide powerful additional options for **Typescript Compiler**

## Requirements
- `nodejs` >= `v12.16.0`
 - `npm` >= `v6.14.0` (or `yarn` >= `v1.22.0`)


## Installation
using **npm**

```shell script
npm install --save-dev typescript atco
```

Or using **yarn**
```shell script
yarn add --dev typescript atco
```

## Getting Started
- Navigate to project root and create `tconfig.json` file

- In `tconfig.json` file you have to specific the output directory using `compilerOptions.outDir` and specific the target directory using `include`, like the following example

```json
{
  "compilerOptions": {
    "outDir": "./dist"  
  },
  "include": ["./src/**/*"]
}
```

- Then run the following command to start nodejs server in development mode
```shell script
atco -w --exec "node ./dist/index.js"
```
- Or run it in production mode using
```shell script
atco --exec "node ./dist/index.js"
```

## The Additional Options (API)

| AdditionalOption  | Type | Default | Description |
| -------------- | ---- | ------- | ----------- |
| `--copyOthers` | boolean | true | Copy files (which doesn't end with extension `.js` or `.ts`) and directories (which doesn't contain any file end with extension `.js` or `.ts`)
| `--cleanOutDir` | boolean | true | Remove all files and directories in output directory before start running
| `--exec` | string |  | Execute the given command when compiling (and copying if `--copyOthers` set to `true`) done successfully

> **NOTE:** if output directory not exists atco will automatically create it, the puropse of `--cleanOutDir` is clean the output directory if it was exists

The other options except (`--project`, `-p`, `--version`,`--help`) will be forward to **Typescript Compiler** (take a look at [typescript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html))

## Know Problems
The following problems is currently happening however we will try to fix it in the future
- In `watch` mode atco doesn't track remove event (so if you remove file or directory you have to rerun command)
