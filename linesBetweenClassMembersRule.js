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
exports.__esModule = true;
var Lint = require("tslint");
var ts = require("typescript");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LinesBetweenClassMembersWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "must have blank line between class methods";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var LinesBetweenClassMembersWalker = /** @class */ (function (_super) {
    __extends(LinesBetweenClassMembersWalker, _super);
    function LinesBetweenClassMembersWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinesBetweenClassMembersWalker.prototype.visitMethodDeclaration = function (node) {
        if (!this.isPreviousLineBlank(node, this.getSourceFile())) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
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
    return LinesBetweenClassMembersWalker;
}(Lint.RuleWalker));
