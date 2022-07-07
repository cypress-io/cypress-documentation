"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypressConfigPluginExample = void 0;
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const createDirective_1 = require("../utils/createDirective");
const hydratePluginSample_1 = require("./hydratePluginSample");
const matchHelpers_1 = require("../utils/matchHelpers");
function cypressConfigPluginExample() {
    const tagName = 'cypress-config-plugin-example';
    (0, createDirective_1.createDirective)(this, tagName);
    return (root) => {
        (0, unist_util_visit_1.default)(root, 'containerDirective', (node) => {
            if ((0, matchHelpers_1.isMatchedDirective)(node, tagName)) {
                let result = [];
                if (node.children.length === 1 && (0, matchHelpers_1.isCode)(node.children[0])) {
                    result = transformNode(node.children[0]);
                }
                else if ((0, matchHelpers_1.isCode)(node.children[0]) && (0, matchHelpers_1.isCode)(node.children[1])) {
                    result = transformNode(node.children[1], node.children[0]);
                }
                else {
                    result = node.children;
                }
                node.children = result;
            }
        });
    };
}
exports.cypressConfigPluginExample = cypressConfigPluginExample;
function transformNode(codeNode, importNode) {
    const tsCode = (0, hydratePluginSample_1.hydratePluginSample)(codeNode.value, importNode === null || importNode === void 0 ? void 0 : importNode.value);
    return [
        {
            type: 'jsx',
            value: `<CypressConfigFileTabs>\n`,
        },
        {
            type: 'code',
            lang: 'typescript',
            meta: 'copyTsToJs',
            value: tsCode,
        },
        {
            type: 'jsx',
            value: `\n</CypressConfigFileTabs>`,
        },
    ];
}
//# sourceMappingURL=cypressConfigPluginExample.js.map