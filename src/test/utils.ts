import {LintResult} from 'tslint';
import {AssertContext} from 'ava';

export function getFailureMessage(results: LintResult): string {
  return JSON.parse(results.output)[0].failure;
}

export function checkDefaultFailMessage(t: AssertContext, results: LintResult) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = 'must have at least one new line between class methods';
  t.is(failMessage, expectedFailMessage);
}

export function checkNumLinesFailMessage(t: AssertContext, results: LintResult, numLines: number) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = `must have ${numLines} new line(s) between class methods`;
  t.is(failMessage, expectedFailMessage);
}

export function checkInvalidConfigFailMessage(t: AssertContext, results: LintResult) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = `invalid value provided for num lines configuration - abc, see docs for how to configure`;
  t.is(failMessage, expectedFailMessage);
}
