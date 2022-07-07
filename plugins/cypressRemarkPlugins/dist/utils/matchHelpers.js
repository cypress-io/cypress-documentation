"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCode = exports.isMatchedDirective = void 0;
function isMatchedDirective(node, tagName) {
    var _a;
    return (Array.isArray(node.children) && ((_a = node.data) === null || _a === void 0 ? void 0 : _a.hName) === tagName);
}
exports.isMatchedDirective = isMatchedDirective;
function isCode(node) {
    return node.type === 'code';
}
exports.isCode = isCode;
//# sourceMappingURL=matchHelpers.js.map