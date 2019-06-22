import test, {AssertContext} from 'ava';
import {TestHelpers} from '../../test/helpers';

test('fixes no line between class methods', (t: AssertContext) => {
  console.log('test');
  const fixed = TestHelpers.fix('fails/noLine.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line but a method comment between class methods', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndMethodComment.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line between variable and class method', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineBetweenVarAndMethod.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line but a comment between variable and class method', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentBetweenVarAndMethod.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line between variable and constructor', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineBetweenVarAndConstructor.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line but a comment between variable and constructor', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentBetweenVarAndConstructor.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes no new line and a comment above the class', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/noLineAndCommentAboveClass.ts');
  t.is(fixed.target, fixed.actual);
});

test('fixes 1 line specified and 0 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/oneLineNoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(fixed.target, fixed.actual);
});

test('fixes 1 line specified and 2 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/oneLineTwoNewLines.ts', 'tslint-num-lines-1.json');
  t.is(fixed.target, fixed.actual);
});

test('fixes 2 lines specified and 1 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/twoLinesOneNewLine.ts', 'tslint-num-lines-2.json');
  t.is(fixed.target, fixed.actual);
});

test('fixes 2 lines specified and 3 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/twoLinesThreeNewLines.ts', 'tslint-num-lines-2.json');
  t.is(fixed.target, fixed.actual);
});

test('fixes 0 lines specified and 1 line difference', (t: AssertContext) => {
  const fixed = TestHelpers.fix('fails/zeroLinesOneNewLine.ts', 'tslint-num-lines-0.json');
  t.is(fixed.target, fixed.actual);
});
