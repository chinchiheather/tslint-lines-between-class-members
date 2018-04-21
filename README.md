# tslint-lines-between-class-members
Custom rule for TSLint to enforce blank lines between class methods - achieves a similar thing to [lines-between-class-members in ESLint](https://github.com/eslint/eslint/blob/master/docs/rules/lines-between-class-members.md)

## Setup
1. Install package

```
# yarn
yarn add --dev tslint-lines-between-class-members

# npm
npm install --save-dev tslint-lines-between-class-members
```
2. Update your tslint.json config file, adding the new rules directory and rule

```
{
  "rulesDirectory": [
    ...
    "node_modules/tslint-lines-between-class-members"
    ...
  ],
  "rules": {
    ...
    "lines-between-class-members": true,
    ...
  }
}
  

