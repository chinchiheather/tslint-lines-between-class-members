import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new LinesBetweenClassMembersWalker(sourceFile, this.getOptions()),
    );
  }
}

class LinesBetweenClassMembersWalker extends Lint.RuleWalker {

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
    const arePrevLinesBlank = this.arePreviousLinesBlank(node, this.getSourceFile());
    const isPrevLineClassDec = this.isPreviousLineClassDec(node, this.getSourceFile());
    const isPrevLineOpeningBrace = this.isPrevLineOpeningBrace(node, this.getSourceFile());
    if (!arePrevLinesBlank && !isPrevLineClassDec && !isPrevLineOpeningBrace) {
      this.onRuleLintFail(node);
    }
  }

  /**
   * Tests lines above the method are blank
   * Tests exact number of lines if option has been specified, or just checks for one new line if not
   * A line is considered blank if it is an empty new line or if there are only whitespace characters present
   */
  private arePreviousLinesBlank(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const options = this.getOptions();
    if (options.length > 0) {
      // if user has specified the number of new lines they want between their methods
      // we need to check there are exactly that many blank lines

      const numLinesOption = options[0];
      // check for invalid num lines option
      if (!/^[0-9]+$/.test(numLinesOption)) {
        return false;
      }

      // check each previous line is blank for num lines specified
      let i;
      for (i = 0; i < numLinesOption; i++) {
        if (!this.isLineBlank(this.getPrevLinesText(node, sourceFile, i + 1))) {
          return false;
        }
      }

      // finally, check line before is not blank
      return !this.isLineBlank(this.getPrevLinesText(node, sourceFile, i + 1));
    } else {
      // if user has not specified the number of blank lines, we just want to check there
      // is at least one
      return this.isLineBlank(this.getPrevLinesText(node, sourceFile));
    }
  }

  private isLineBlank(line: string) {
    return line.length === 0 || !(/\S/.test(line));
  }

  /**
   * Tests whether the previous line is the class declaration
   * We do not want to enforce a new line between class declaration and constructor (or other first method)
   */
  private isPreviousLineClassDec(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const prevLine = this.getPrevLinesText(node, sourceFile);
    return /\bclass\b\s+[A-Za-z0-9]+/.test(prevLine);
  }

  /**
   * Tests whether the previous line is the opening brace
   * We do not want to enforce a newline after opening brace for the class declaration
   */
  private isPrevLineOpeningBrace(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const prevLine = this.getPrevLinesText(node, sourceFile);
    return prevLine.trim() === '{';
  }

  /**
   * Gets the text content of a line above the method
   * Any documenting comments are ignored and we start from the first line above those
   * If lineIndex is passed, it will get the text of the nth line above the method
   */
  private getPrevLinesText(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile, lineIndex = 1): string {
    let pos = node.getStart();

    const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
    if (comments.length > 0) {
      pos = comments[0].pos;
    }

    const lineStartPositions = <any>sourceFile.getLineStarts();
    const startPosIdx = lineStartPositions.findIndex((startPos, idx) =>
      startPos > pos || idx === lineStartPositions.length - 1
    ) - lineIndex;

    return sourceFile.text.substring(lineStartPositions[startPosIdx - 1], lineStartPositions[startPosIdx] - 1);
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

    const replacement = new Lint.Replacement(start, width, `\n  ${text}`);
    // handle both tslint v4 & v5
    let fix: any;
    if (typeof Lint['Fix'] === 'undefined') {
      fix = replacement;
    } else {
      fix = new Lint['Fix']('lines-between-class-members', [replacement]);
    }

    const options = this.getOptions();
    const numLinesOption = options[0];
    let errorMessage;
    if (numLinesOption == null) {
      errorMessage = 'must have at least one new line between class methods';
    } else if (!/^[0-9]+$/.test(numLinesOption)) {
      errorMessage = `invalid value provided for num lines configuration - ${numLinesOption}, see docs for how to configure`;
    } else {
      errorMessage = `must have ${numLinesOption} new line(s) between class methods, see docs for how to configure`;
    }

    this.addFailure(this.createFailure(start, width, errorMessage, fix));
  }
}
