import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "must have blank line between class methods";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new LinesBetweenClassMembersWalker(sourceFile, this.getOptions()),
    );
  }
}

class LinesBetweenClassMembersWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(node: ts.MethodDeclaration) {

    if (!this.isPreviousLineBlank(node, this.getSourceFile())) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    // call the base version of this visitor to actually parse this node
    super.visitMethodDeclaration(node);
  }

  private isPreviousLineBlank(node: ts.MethodDeclaration, sourceFile: ts.SourceFile): boolean {
    let pos = node.getStart();

    const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
    if (comments.length > 0) {
      pos = comments[0].pos;
    }

    const lineStartPositions = <any>sourceFile.getLineStarts();
    let startPosIdx = lineStartPositions.findIndex((startPos, idx) =>
      startPos > pos || idx === lineStartPositions.length - 1
    ) - 1;

    return lineStartPositions[startPosIdx - 1] === lineStartPositions[startPosIdx] - 1;
  }
}
