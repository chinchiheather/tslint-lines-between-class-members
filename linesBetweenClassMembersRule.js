"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LinesBetweenClassMembersWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var LinesBetweenClassMembersWalker = (function (_super) {
    __extends(LinesBetweenClassMembersWalker, _super);
    function LinesBetweenClassMembersWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.difference = 0;
        return _this;
    }
    LinesBetweenClassMembersWalker.prototype.visitConstructorDeclaration = function (node) {
        this.validate(node);
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    LinesBetweenClassMembersWalker.prototype.visitMethodDeclaration = function (node) {
        this.validate(node);
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    LinesBetweenClassMembersWalker.prototype.validate = function (node) {
        var arePrevLinesBlank = this.arePreviousLinesBlank(node, this.getSourceFile());
        var isPrevLineClassDec = this.isPreviousLineClassDec(node, this.getSourceFile());
        var isPrevLineOpeningBrace = this.isPrevLineOpeningBrace(node, this.getSourceFile());
        var isClassMethod = this.isClassMethod(node);
        if (!arePrevLinesBlank && !isPrevLineClassDec && !isPrevLineOpeningBrace && isClassMethod) {
            this.onRuleLintFail(node);
        }
    };
    /**
     * Tests lines above the method are blank
     * Tests exact number of lines if option has been specified, or just checks for one new line if not
     * A line is considered blank if it is an empty new line or if there are only whitespace characters present
     */
    LinesBetweenClassMembersWalker.prototype.arePreviousLinesBlank = function (node, sourceFile) {
        var options = this.getOptions();
        this.difference = 0;
        if (options.length > 0) {
            // if user has specified the number of new lines they want between their methods
            // we need to check there are exactly that many blank lines
            var numLinesOption = options[0];
            // check for invalid num lines option
            if (!/^[0-9]+$/.test(numLinesOption)) {
                return false;
            }
            // check each previous line is blank for num lines specified
            var i = void 0;
            for (i = 0; i < numLinesOption; i++) {
                if (!this.isLineBlank(this.getPrevLinesText(node, sourceFile, i + 1))) {
                    this.difference = numLinesOption - i;
                    return false;
                }
            }
            // then check that the line before is NOT blank
            // we count how many lines it takes to get to a non-blank one so we can fix properly
            var isLineBlank = this.isLineBlank(this.getPrevLinesText(node, sourceFile, i + 1));
            if (isLineBlank) {
                while (isLineBlank) {
                    i++;
                    this.difference--;
                    isLineBlank = this.isLineBlank(this.getPrevLinesText(node, sourceFile, i + 1));
                }
                return false;
            }
            return true;
        }
        else {
            // if user has not specified the number of blank lines, we just want to check there
            // is at least one
            return this.isLineBlank(this.getPrevLinesText(node, sourceFile));
        }
    };
    LinesBetweenClassMembersWalker.prototype.isLineBlank = function (line) {
        return line.length === 0 || !(/\S/.test(line));
    };
    /**
     * Tests whether the previous line is the class declaration
     * We do not want to enforce a new line between class declaration and constructor (or other first method)
     */
    LinesBetweenClassMembersWalker.prototype.isPreviousLineClassDec = function (node, sourceFile) {
        var prevLine = this.getPrevLinesText(node, sourceFile);
        return /\b(class|implements|extends)\b\s+[A-Za-z0-9]+/.test(prevLine);
    };
    /**
     * Tests whether the previous line is the opening brace
     * We do not want to enforce a newline after opening brace for the class declaration
     */
    LinesBetweenClassMembersWalker.prototype.isPrevLineOpeningBrace = function (node, sourceFile) {
        var prevLine = this.getPrevLinesText(node, sourceFile);
        return prevLine.trim() === '{';
    };
    /**
     * Tests whether method is within a class (as opposed to within an object literal)
     */
    LinesBetweenClassMembersWalker.prototype.isClassMethod = function (node) {
        var parentType = node.parent && node.parent.kind;
        return parentType === ts.SyntaxKind.ClassDeclaration;
    };
    /**
     * Gets the text content of a line above the method
     * Any documenting comments are ignored and we start from the first line above those
     * If lineIndex is passed, it will get the text of the nth line above the method
     */
    LinesBetweenClassMembersWalker.prototype.getPrevLinesText = function (node, sourceFile, lineIndex) {
        if (lineIndex === void 0) { lineIndex = 1; }
        var pos = node.getStart();
        var comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
        if (comments.length > 0) {
            pos = comments[0].pos;
        }
        var lineStartPositions = sourceFile.getLineStarts();
        var startPosIdx = lineStartPositions.findIndex(function (startPos, idx) {
            return startPos > pos || idx === lineStartPositions.length - 1;
        }) - lineIndex;
        return sourceFile.text.substring(lineStartPositions[startPosIdx - 1], lineStartPositions[startPosIdx] - 1);
    };
    LinesBetweenClassMembersWalker.prototype.onRuleLintFail = function (node) {
        var start = node.getStart();
        var width = node.getWidth();
        var text = node.getText();
        var comments = ts.getLeadingCommentRanges(this.getSourceFile().text, node.pos) || [];
        if (comments.length > 0) {
            start = comments[0].pos;
            width = comments[0].end - start;
            text = this.getSourceFile().text.substr(start, width);
        }
        var errorMessage;
        var replacement;
        var fix;
        var options = this.getOptions();
        var numLinesOption = options[0];
        if (numLinesOption == null) {
            errorMessage = 'must have at least one new line between class methods';
            replacement = new Lint.Replacement(start, width, "\n  " + text);
        }
        else if (!/^[0-9]+$/.test(numLinesOption)) {
            errorMessage = "invalid value provided for num lines configuration - " + numLinesOption + ", see docs for how to configure";
        }
        else {
            errorMessage = "must have " + numLinesOption + " new line(s) between class methods, see docs for how to configure";
            if (this.difference > 0) {
                // not enough new lines add some more
                var newLines = Array(this.difference).fill('\n').join('');
                replacement = new Lint.Replacement(start, width, newLines + "  " + text);
            }
            else if (this.difference < 0) {
                // too many lines delete some
                var lineStartPositions_1 = this.getSourceFile().getLineStarts();
                var startPosIdx = lineStartPositions_1.findIndex(function (startPos, idx) {
                    return startPos > start || idx === lineStartPositions_1.length - 1;
                }) - 1;
                start = lineStartPositions_1[startPosIdx + this.difference];
                width += lineStartPositions_1[startPosIdx] - start + 2;
                replacement = new Lint.Replacement(start, width, "  " + text);
            }
        }
        if (replacement) {
            // handle both tslint v4 & v5
            if (typeof Lint['Fix'] === 'undefined') {
                fix = replacement;
            }
            else {
                fix = new Lint['Fix']('lines-between-class-members', [replacement]);
            }
        }
        this.addFailure(this.createFailure(start, width, errorMessage, fix));
    };
    return LinesBetweenClassMembersWalker;
}(Lint.RuleWalker));
