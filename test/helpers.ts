import {Linter, LintResult, Configuration} from "tslint";
import * as fs from "fs";
import * as path from "path";

export class TestHelpers {

  /**
   * Runs tslint on the fixture with only the lines-between-class-members rule enabled
   * Returns the linting results
   */
  static lint(fixture: string): LintResult {
    const linter = new Linter({ formatter: 'json', fix: false });

    const fileName = path.resolve(__dirname, '..', `test/fixtures/${fixture}`);
    const fileContents = fs.readFileSync(fileName, 'utf8');

    const configurationFilename = './test/tslint.json';
    const configuration = Configuration.findConfiguration(configurationFilename, fileName).results;

    linter.lint(fileName, fileContents, configuration);
    return linter.getResult();
  }
}
