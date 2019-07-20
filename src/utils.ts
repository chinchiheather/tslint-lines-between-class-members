import * as ts from 'typescript';

export const isLineBlank = (line: string): boolean =>
  line.length === 0 || !(/\S/.test(line));

/**
 * Tests whether the previous line is the class declaration
 */
export const isPreviousLineClassDec = (node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean => {
  const prevLine = this.getPrevLinesText(node, sourceFile);
  return /\b(class|implements|extends)\b\s+[A-Za-z0-9]+/.test(prevLine);
};

/**
 * Tests whether the previous line is the opening brace
 */
export const isPrevLineOpeningBrace = (node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): boolean => {
  const prevLine = getPrevLinesText(node, sourceFile);
  return /^((\s*{\s*)|([\w\s,<]*\>\s*{\s*))$/.test(prevLine);
};

/**
 * Tests whether method is within a class (as opposed to within an object literal)
 */
export const isClassMethod = (node: ts.FunctionLikeDeclaration): boolean => {
  const parentType = node.parent && node.parent.kind;
  return parentType === ts.SyntaxKind.ClassDeclaration;
};

/**
 * Gets the text content of a line above the method
 * Any documenting comments are ignored and we start from the first line above those
 * If lineIndex is passed, it will get the text of the nth line above the method
 */
export const getPrevLinesText = (node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile, lineIndex = 1): string =>
  sourceFile.text.substring(getNodeLineStart(node, sourceFile, lineIndex + 1), getNodeLineStart(node, sourceFile, lineIndex) - 1);

/**
 * Gets position of start of line containing node
 */
export const getNodeLineStart = (node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile, lineIndex = 1): number => {
  let pos = node.getStart();

  const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
  if (comments.length > 0) {
    pos = comments[0].pos;
  }

  const lineStartPositions = <any>sourceFile.getLineStarts();
  const startPosIdx = lineStartPositions.findIndex((startPos, idx) =>
    startPos > pos || idx === lineStartPositions.length - 1
  ) - lineIndex;

  return lineStartPositions[startPosIdx];
};

/**
 * Calculates difference in actual numbers of lines above node and number set in options
 */
export const getLineDifference = (node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile, options: any): number => {
  let difference = 0;
  if (options.length > 0) {
    // if user has specified the number of new lines they want between their methods
    // we need to check there are exactly that many blank lines

    const numLinesOption = options[0];
    // check for invalid num lines option
    if (!/^[0-9]+$/.test(numLinesOption)) {
      return 1;
    }

    // check each previous line is blank for num lines specified
    let i;
    for (i = 0; i < numLinesOption; i++) {
      if (!isLineBlank(getPrevLinesText(node, sourceFile, i + 1))) {
        difference = numLinesOption - i;
        return difference;
      }
    }

    // then check that the line before is NOT blank
    // we count how many lines it takes to get to a non-blank one so we can fix properly
    let lineBlank = isLineBlank(getPrevLinesText(node, sourceFile, i + 1));
    if (lineBlank) {
      while (lineBlank) {
        i++;
        difference--;
        lineBlank = isLineBlank(getPrevLinesText(node, sourceFile, i + 1));
      }
      return difference;
    }
    return difference;
  } else {
    // if user has not specified the number of blank lines, we just want to check there
    // is at least one
    return isLineBlank(getPrevLinesText(node, sourceFile)) ? 0 : 1;
  }
};
