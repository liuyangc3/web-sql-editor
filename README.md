# Web SQL Editor [![Build Status](https://travis-ci.org/liuyangc3/web-sql-editor.svg?branch=master)]

A SQL editor base on web

## Quick Install

```sh

```

## Development 

storybook install
```sh
npm i --save-dev @storybook/react
npm i --save-dev babel-core
npm i --save-dev babel-loader
```
## Visual Studio Code

make sure VS Code Chrome Debugger Extension installed.

Then add the block below to your `launch.json` file and put it inside the `.vscode` folder.
```
{
  "version": "0.2.0",
  "configurations": [{
    "name": "Chrome",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceRoot}/src",
    "sourceMapPathOverrides": {
      "webpack:///src/*": "${webRoot}/*"
    }
  }]
}
```
## License

Web SQL Editor is open source software [licensed as MIT](https://github.com/facebook/create-react-app/blob/master/LICENSE).