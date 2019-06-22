import test, {AssertContext} from 'ava';
import {TestHelpers} from '../../test/helpers';
import {LintResult} from 'tslint';

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

test('passes when 2 lines specified and 2 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/twoNewLines.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 0);
});

test('passes when 0 lines specified and 0 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/noNewLines.ts', 'tslint-num-lines-0.json');
  t.is(results.errorCount, 0);
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
