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
Rule.FAILURE_STRING = "must have blank line between class methods";
exports.Rule = Rule;
var LinesBetweenClassMembersWalker = (function (_super) {
    __extends(LinesBetweenClassMembersWalker, _super);
    function LinesBetweenClassMembersWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinesBetweenClassMembersWalker.prototype.visitMethodDeclaration = function (node) {
        if (!this.isPreviousLineBlank(node, this.getSourceFile())) {
            this.onRuleLintFail(node);
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    LinesBetweenClassMembersWalker.prototype.isPreviousLineBlank = function (node, sourceFile) {
        var pos = node.getStart();
        var comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos) || [];
        if (comments.length > 0) {
            pos = comments[0].pos;
        }
        var lineStartPositions = sourceFile.getLineStarts();
        var startPosIdx = lineStartPositions.findIndex(function (startPos, idx) {
            return startPos > pos || idx === lineStartPositions.length - 1;
        }) - 1;
        return lineStartPositions[startPosIdx - 1] === lineStartPositions[startPosIdx] - 1;
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
        var replacement = new Lint.Replacement(start, width, "\n  " + text);
        // handle both tslint v4 & v5
        var fix;
        if (typeof Lint['Fix'] === 'undefined') {
            fix = replacement;
        }
        else {
            fix = new Lint['Fix']('lines-between-class-members', [replacement]);
        }
        this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING, fix));
    };
    return LinesBetweenClassMembersWalker;
}(Lint.RuleWalker));
