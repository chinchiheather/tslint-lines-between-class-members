import test, {AssertContext} from 'ava';
import {TestHelpers} from '../../test/helpers';
import {checkDefaultFailMessage, checkNumLinesFailMessage, checkInvalidConfigFailMessage} from './utils';

test('fails when no line between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLine.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fails if no new line but a method comment between class methods', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndMethodComment.ts');
  t.is(results.errorCount, 2);
  checkDefaultFailMessage(t, results);
});

test('fails if no new line between variable and class method', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineBetweenVarAndMethod.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fails if no new line but a comment between variable and class method', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentBetweenVarAndMethod.ts');
  t.is(results.errorCount, 2);
  checkDefaultFailMessage(t, results);
});

test('fails if no new line between variable and constructor', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineBetweenVarAndConstructor.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fails if no new line but a comment between variable and constructor', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentBetweenVarAndConstructor.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fails when no new line and a comment above the class', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/noLineAndCommentAboveClass.ts');
  t.is(results.errorCount, 1);
  checkDefaultFailMessage(t, results);
});

test('fails when 1 line specified and 0 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/oneLineNoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(results.errorCount, 1);
  checkNumLinesFailMessage(t, results, 1);
});

test('fails when 1 line specified and 2 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/oneLineTwoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 1);
});

test('fails when 2 lines specified and 1 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/twoLinesOneNewLine.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 2);
});

test('fails when 2 lines specified and 3 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/twoLinesThreeNewLines.ts', 'tslint-num-lines-2.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 2);
});

test('fails when 0 lines specified and 1 line difference', (t: AssertContext) => {
  const results = TestHelpers.lint('fails/zeroLinesOneNewLine.ts', 'tslint-num-lines-0.json');
  t.is(results.errorCount, 2);
  checkNumLinesFailMessage(t, results, 0);
});

test('fails when invalid value passed for num lines option', (t: AssertContext) => {
  const results = TestHelpers.lint('passes/emptyNewLine.ts', 'tslint-num-lines-invalid.json');
  t.is(results.errorCount, 2);
  checkInvalidConfigFailMessage(t, results);
});
