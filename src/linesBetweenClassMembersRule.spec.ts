import test, {AssertContext} from 'ava';
import {TestHelpers} from '../test/helpers';

test('fails when no line between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLine.ts');
  t.is(results.errorCount, 1);
});

test('fails if no new line but a method comment between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndMethodComment.ts');
  t.is(results.errorCount, 2);
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
  const results = TestHelpers.lint('passes/multipleNewLines.ts');
  t.is(results.errorCount, 0);
});

test('passes if first method in class and no new line before it', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/firstMethodNoNewLine.ts');
  t.is(results.errorCount, 0);
});

test('passes if new line and method comment between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/newLineAndMethodComment.ts');
  t.is(results.errorCount, 0);
});
