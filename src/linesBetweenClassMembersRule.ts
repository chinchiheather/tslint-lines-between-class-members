import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'must have blank line between class methods';

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
    const isPrevLineBlank = this.isPreviousLineBlank(node, this.getSourceFile());
    const isPrevLineClassDec = this.isPreviousLineClassDec(node, this.getSourceFile());
    const isPrevLineOpeningBrace = this.isPrevLineOpeningBrace(node, this.getSourceFile());
    if (!isPrevLineBlank && !isPrevLineClassDec && !isPrevLineOpeningBrace) {
      this.onRuleLintFail(node);
    }
  }

  /**
   * Tests if the line above the method is blank
   * A line is considered blank if it is an empty new line or if there are only whitespace characters present
   */
  private isPreviousLineBlank(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const prevLine = this.getPrevLineText(node, sourceFile);
    return prevLine.length === 0 || !(/\S/.test(prevLine));
  }

  /**
   * Tests whether the previous line is the class declaration
   * We do not want to enforce a new line between class declaration and constructor (or other first method)
   */
  private isPreviousLineClassDec(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const prevLine = this.getPrevLineText(node, sourceFile);
    return /\bclass\b\s+[A-Za-z0-9]+/.test(prevLine);
  }

  /**
   * Tests whether the previous line is the opening brace
   * We do not want to enforce a newline after opening brace for the class declaration
   */
  private isPrevLineOpeningBrace(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean {
    const prevLine = this.getPrevLineText(node, sourceFile);
    return prevLine.trim() === '{';
  }

  /**
   * Gets the text content of the line above the method
   * Any documenting comments are ignored and the first line above those will be retrieved instead
   */
  private getPrevLineText(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): string {
    let pos = node.getStart();

    const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
    if (comments.length > 0) {
      pos = comments[0].pos;
    }

    const lineStartPositions = <any>sourceFile.getLineStarts();
    const startPosIdx = lineStartPositions.findIndex((startPos, idx) =>
      startPos > pos || idx === lineStartPositions.length - 1
    ) - 1;

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

    this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING, fix));
  }
}
