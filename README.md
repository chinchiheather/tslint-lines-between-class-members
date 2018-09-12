# tslint-lines-between-class-members
[![npm](https://img.shields.io/npm/dm/tslint-lines-between-class-members.svg)](https://www.npmjs.com/package/tslint-lines-between-class-members) [![CircleCI](https://img.shields.io/circleci/project/github/chinchiheather/tslint-lines-between-class-members.svg)](https://circleci.com/gh/chinchiheather/tslint-lines-between-class-members/tree/master)


Custom rule for TSLint to enforce blank lines between class methods - achieves a similar thing to [lines-between-class-members in ESLint](https://github.com/eslint/eslint/blob/master/docs/rules/lines-between-class-members.md)

## Install
```bash
# yarn
yarn add --dev tslint-lines-between-class-members

# npm
npm install --save-dev tslint-lines-between-class-members
```

## Configuration
Update your `tslint.json` config file, adding the new rules directory and the new rule  
You can choose to specify the exact number of lines you want between methods, or leave it to default to just checking there is at least 1

```json
{
  "rulesDirectory": [
    "node_modules/tslint-lines-between-class-members"
  ],
  "rules": {
    "lines-between-class-members": true,
  }
}
```

### Config Examples

At least one line:

```json
"lines-between-class-members": true
```

Exactly one line:

```json
"lines-between-class-members": [true, 1]
```

Exactly twenty two lines:

```json
"lines-between-class-members": [true, 22]
```
