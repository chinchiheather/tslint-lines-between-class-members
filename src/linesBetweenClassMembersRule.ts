import * as Lint from 'tslint';
import * as ts from 'typescript';
import {
  isPreviousLineClassDec,
  isClassMethod,
  isPrevLineOpeningBrace,
  getNodeLineStart,
  getLineDifference
} from './utils';

export class Rule extends Lint.Rules.AbstractRule {
  static readonly metadata: Lint.IRuleMetadata = {
    ruleName: 'lines-between-class-members',
    type: 'style',
    description: 'Forces all classes to have at least one, or an exact number of, lines between class members',
    options: 'boolean',
    optionsDescription: 'Exact number of lines that should be between class members',
    rationale: 'Ensures consistency between classes',
    typescriptOnly: true,
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new LinesBetweenClassMembersWalker(sourceFile, this.getOptions()),
    );
  }
}

class LinesBetweenClassMembersWalker extends Lint.RuleWalker {
  private difference;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this.difference = 0;
  }

  public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
    this.validate(node);

    // call the base version of this visitor to actually parse this node
    super.visitConstructorDeclaration(node);
  }

  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    this.validate(node);

    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  private validate(node: ts.FunctionLikeDeclaration) {
    /* Calculate difference between lines above class member and desired lines */
    this.difference = getLineDifference(node, this.getSourceFile(), this.getOptions());

    /* Ignore method immediately following class declaration */
    const prevLineClassDec = isPreviousLineClassDec(node, this.getSourceFile());
    const prevLineOpeningBrace = isPrevLineOpeningBrace(node, this.getSourceFile());

    /* Ignore methods inside object literals */
    const classMethod = isClassMethod(node);

    if (this.difference !== 0 && !prevLineClassDec && !prevLineOpeningBrace && classMethod) {
      this.onRuleLintFail(node);
    }
  }

  private onRuleLintFail(node: ts.FunctionLikeDeclaration) {
    let start = node.getStart();
    let width = node.getWidth();
    let text = node.getText();

    const comments = ts.getLeadingCommentRanges(this.getSourceFile().text, node.pos) || [];
    if (comments.length > 0) {
      start = comments[0].pos;
      width = comments[0].end - start;
      text = this.getSourceFile().text.substr(start, width);
    }

    let errorMessage;
    let replacement: Lint.Replacement;
    let fix: any;

    const options = this.getOptions();
    const numLinesOption = options[0];
    const sourceFile = this.getSourceFile();

    // find whitespace identation of current line, node start is start of text but any
    // identation needs to be calculated here
    let whitespace = '';
    const lineStart = getNodeLineStart(node, sourceFile);
    if (lineStart !== start) {
      whitespace = Array(start - lineStart).fill(' ').join('');
      width += start - lineStart;
      start = lineStart;
    }

    if (numLinesOption == null) {
      errorMessage = 'must have at least one new line between class methods';
      replacement = new Lint.Replacement(start, width, `\n${whitespace}${text}`);
    } else if (!/^[0-9]+$/.test(numLinesOption)) {
      errorMessage = `invalid value provided for num lines configuration - ${numLinesOption}, see docs for how to configure`;
    } else {
      errorMessage = `must have ${numLinesOption} new line(s) between class methods`;

      if (this.difference > 0) {
        // not enough new lines add some more
        const newLines = Array(this.difference).fill('\n').join('');
        replacement = new Lint.Replacement(start, width, `${newLines}${whitespace}${text}`);
      } else if (this.difference < 0) {
        // too many lines delete some
        const lineStartPositions = <any>this.getSourceFile().getLineStarts();
        const startPosIdx = lineStartPositions.findIndex((startPos, idx) =>
          startPos > start || idx === lineStartPositions.length - 1
        ) - 1;

        start = lineStartPositions[startPosIdx + this.difference];
        width += lineStartPositions[startPosIdx] - start;

        replacement = new Lint.Replacement(start, width, `${whitespace}${text}`);
      }
    }

    if (replacement) {
      // handle both tslint v4 & v5
      if (typeof Lint['Fix'] === 'undefined') {
        fix = replacement;
      } else {
        fix = new Lint['Fix']('lines-between-class-members', [replacement]);
      }
    }

    this.addFailure(this.createFailure(start, width, errorMessage, fix));
  }
}
