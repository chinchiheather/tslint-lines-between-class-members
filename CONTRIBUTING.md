# Contributing Guide

## Getting Started

If you have never worked on a custom TSLint rule before, have a quick read through the [custom TSLint rules guide](https://palantir.github.io/tslint/develop/custom-rules/)

Fork the project in Github, then:

```bash
git clone git@github.com:<your-username>/tslint-lines-between-class-members.git
yarn
```

## Working Locally

You can either develop by using TDD or checking the effects of the rule in a sample project

### TDD

Use the `test:watch` script, which will both recompile the rule when you update the `.ts` files and re-run the tests when things change

```bash
yarn test:watch
```

See the [Writing Tests](#writing-tests) section below for more information

### Sample Project

There is a sample project under `./integration/` that uses the compiled version of the rule in the root directory

In the project root run
```bash
yarn compile:watch
```

And then in another terminal run the linting script from inside the sample project:
```bash
cd ./integration/
yarn

yarn lint
# or
yarn lint:fix
```

Your IDE may also be able to show you errors, but it might not always catch up to the latest compiled version of the rule

Play around with the files in the sample project to check TSLint passes/fails when it should, and fixes are applied correctly

## Writing Tests

Tests are found under `./src/test/*.spec.ts`, and they are split into passes, fails & fixes

Pass/fail tests work by loading a fixture Typescript file from `./test/fixtures/`, running TSLint on it and then inspecting the linting result - checking the number of errors and/or the error messages. There are a variety of config files used to apply the rule using its different options, these live in `./test/configs/`.

The fix tests load a fixture from `./test/fixtures/fails/` and run TSLint with the `--fix` flag and then compare the "fixed" file with a fixture file of the same name but under the `./test/fixtures/fails/fixes/` directory. The file under `./test/fixtures/fails/fixes/` represents how the file should look once it has been fixed.

Any new feature/bug fix will require a test to be added

Tests are written using [Ava](https://github.com/avajs/ava) and can be run with either:

```bash
yarn test
yarn test:watch
```

## Creating Pull Request

Create a pull request through Github and it will be reviewed, and then merged if all is good

A Circle CI build will trigger automatically, which will lint & test the code and ensure it compiles without errors

## Versioning/Publishing

You don't need to worry about this; it will be handled for you when your pull request is merged in
