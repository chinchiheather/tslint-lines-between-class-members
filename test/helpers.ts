import {Linter, LintResult, Configuration} from 'tslint';
import * as fs from 'fs';
import * as path from 'path';
import * as tempDir from 'temp-dir';

export class TestHelpers {

  /**
   * Runs tslint on the fixture with only the lines-between-class-members rule enabled
   * Returns the linting results
   */
  static lint(fixture: string, configFile = 'tslint-enabled.json'): LintResult {
    const linter = new Linter({ formatter: 'json', fix: false });

    const fileName = path.resolve(__dirname, '..', `test/fixtures/${fixture}`);
    const fileContents = fs.readFileSync(fileName, 'utf8');

    linter.lint(fileName, fileContents, this.getConfiguration(configFile, fileName));
    return linter.getResult();
  }

  /**
   * Runs tslint on the fixture with only the lines-between-class-members rule enabled and
   * the fix option enabled
   * Creates a temp file to run the fix on and returns its contents after fixing along with
   * the target contents
   */
  static fix(fixture: string, configFile = 'tslint-enabled.json') {
    const linter = new Linter({ formatter: 'json', fix: true });

    const fixtureParts = fixture.split('/');
    const fixtureFileName = fixtureParts[fixtureParts.length - 1];

    const fileName = path.resolve(__dirname, '..', `test/fixtures/${fixture}`);
    const tempFileName = path.resolve(tempDir, fixtureFileName);
    const targetFileName = path.resolve(__dirname, '..', `test/fixtures/fails/fixes/${fixtureFileName}`);

    // copy file contents into a temp file, as we don't want to overwrite the fixture
    const fixtureFileContents = fs.readFileSync(fileName, 'utf8');
    fs.writeFileSync(tempFileName, fixtureFileContents, { encoding: 'utf8' });

    linter.lint(tempFileName, fixtureFileContents, this.getConfiguration(configFile, fileName));

    const targetFileContents = fs.readFileSync(targetFileName, 'utf8');
    const actualFileContents = fs.readFileSync(tempFileName, 'utf8');

    // clean up and delete temp file
    fs.unlinkSync(tempFileName);

    return { target: targetFileContents, actual: actualFileContents };
  }

  private static getConfiguration(configFile, fixtureFile) {
    const configurationFilename = `./test/configs/${configFile}`;
    const configuration = Configuration.findConfiguration(configurationFilename, fixtureFile).results;
    return configuration;
  }
}
