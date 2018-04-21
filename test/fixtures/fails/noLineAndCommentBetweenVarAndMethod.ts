class NoLineAndCommentBetweenVarAndMethod {

  constructor() {}

  myVar: string = 'my nice string';
  /**
   * Documenting this method with block comment
   */
  method() {}

  myNum: number = 24;
  // Documenting this method with single line comment
  method() {}
}
