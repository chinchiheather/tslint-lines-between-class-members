import test, {AssertContext} from 'ava';
import {TestHelpers} from '../test/helpers';
import { LintResult } from 'tslint';

function getFailureMessage(results: LintResult): string {
  return JSON.parse(results.output)[0].failure;
}

function checkDefaultFailMessage(t: AssertContext, results: LintResult) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = 'must have at least one new line between class methods';
  t.is(failMessage, expectedFailMessage);
}

function checkNumLinesFailMessage(t: AssertContext, results: LintResult, numLines: number) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = `must have ${numLines} new line(s) between class methods, see docs for how to configure`;
  t.is(failMessage, expectedFailMessage);
}

function checkInvalidConfigFailMessage(t: AssertContext, results: LintResult) {
  const failMessage = getFailureMessage(results);
  const expectedFailMessage = `invalid value provided for num lines configuration - abc, see docs for how to configure`;
  t.is(failMessage, expectedFailMessage);
}

test('fails when no line between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLine.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fixes no line between class methods', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLine.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails if no new line but a method comment between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndMethodComment.ts');
  t.is(results.errorCount, 2);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line but a method comment between class methods', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndMethodComment.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails if no new line between variable and class method', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineBetweenVarAndMethod.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line between variable and class method', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineBetweenVarAndMethod.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails if no new line but a comment between variable and class method', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentBetweenVarAndMethod.ts');
  t.is(results.errorCount, 2);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line but a comment between variable and class method', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentBetweenVarAndMethod.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails if no new line between variable and constructor', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineBetweenVarAndConstructor.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line between variable and constructor', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineBetweenVarAndConstructor.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails if no new line but a comment between variable and constructor', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentBetweenVarAndConstructor.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line but a comment between variable and constructor', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentBetweenVarAndConstructor.ts');
  t.is(fixed.target, fixed.actual);
});

test('fails when no new line and a comment above the class', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentAboveClass.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fixes no new line and a comment above the class', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentAboveClass.ts');
  t.is(fixed.target, fixed.actual);
});

test('passes when empty new line between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/emptyNewLine.ts');
  t.is(results.errorCount, 0);
});

test('passes when whitespace new line between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/whitespaceNewLine.ts');
  t.is(results.errorCount, 0);
});

test('passes when multiple new lines between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/twoNewLines.ts');
  t.is(results.errorCount, 0);
});

test('passes if first method in class and no new line before it', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/firstMethodNoNewLine.ts');
  t.is(results.errorCount, 0);
});

test('passes if first method in class and opening brace before it', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/firstMethodNewLineWithAllmanBraceStyle.ts');
  t.is(results.errorCount, 0);
});

test('passes if new line and method comment between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/newLineAndMethodComment.ts');
  t.is(results.errorCount, 0);
});

test('does not fail when there is a comment above class', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/commentAboveClass.ts');
  t.is(results.errorCount, 0);
});

test('passes when 1 line specified and 1 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/oneNewLine.ts', 'tslint-num-lines-1.json');
  t.is(results.errorCount, 0);
});

test('fails when 1 line specified and 0 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/oneLineNoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(results.errorCount, 1);
  checkNumLinesFailMessage(t, results, 1);
});

test('fixes 1 line specified and 0 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/oneLineNoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(fixed.target, fixed.actual);
});

test('fails when 1 line specified and 2 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/oneLineTwoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 1);
});

test('fixes 1 line specified and 2 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/oneLineTwoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(fixed.target, fixed.actual);
});

test('passes when 2 lines specified and 2 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/twoNewLines.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 0);
});

test('fails when 2 lines specified and 1 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/twoLinesOneNewLine.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 2);
});

test('fixes 2 lines specified and 1 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/twoLinesOneNewLine.ts', 'tslint-num-lines-2.json');
  t.is(fixed.target, fixed.actual);
});

test('fails when 2 lines specified and 3 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/twoLinesThreeNewLines.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 2);
});

test('fixes 2 lines specified and 3 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/twoLinesThreeNewLines.ts', 'tslint-num-lines-2.json');
  t.is(fixed.target, fixed.actual);
});

test('passes when 0 lines specified and 0 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/noNewLines.ts', 'tslint-num-lines-0.json');
  t.is(results.errorCount, 0);
});

test('fails when 0 lines specified and 1 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/zeroLinesOneNewLine.ts', 'tslint-num-lines-0.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 0);
});

test('fixes 0 lines specified and 1 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/zeroLinesOneNewLine.ts', 'tslint-num-lines-0.json');
  t.is(fixed.target, fixed.actual);
});

test('fails when invalid value passed for num lines option', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/emptyNewLine.ts', 'tslint-num-lines-invalid.json');
  t.is(results.errorCount, 2);
  checkInvalidConfigFailMessage(t, results);
});

test('ignores default exported object', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/exportDefault.ts');
  t.is(results.errorCount, 0);
});

test('ignores default exported object with multiple methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/exportDefaultMultipleMethods.ts');
  t.is(results.errorCount, 0);
});

test('ignores exported object', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/export.ts');
  t.is(results.errorCount, 0);
});

test('ignores exported object with multiple methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/exportMultipleMethods.ts');
  t.is(results.errorCount, 0);
});

test('passes when class dec is split over several lines', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/multilineClassDec.ts');
  t.is(results.errorCount, 0);
});
