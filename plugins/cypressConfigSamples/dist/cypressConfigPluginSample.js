"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypressConfigPluginSample = void 0;
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const hydratePluginSample_1 = require("./hydratePluginSample");
function cypressConfigPluginSample() {
    return (root) => {
        (0, unist_util_visit_1.default)(root, (node) => {
            if (isParent(node)) {
                let index = 0;
                while (index < node.children.length) {
                    const child = node.children[index];
                    if (matchNode(child)) {
                        const result = transformNode(child);
                        node.children.splice(index, 1, ...result);
                        index += result.length;
                    }
                    else {
                        index += 1;
                    }
                }
            }
        });
    };
}
exports.cypressConfigPluginSample = cypressConfigPluginSample;
function isParent(node) {
    return Array.isArray(node.children);
}
function matchNode(node) {
    var _a;
    return (node.type === 'code' &&
        typeof node.meta === 'string' &&
        ((_a = node.meta) !== null && _a !== void 0 ? _a : '').startsWith('cypressConfigPluginSample'));
}
function transformNode(node) {
    const tsCode = (0, hydratePluginSample_1.hydratePluginSample)(node.value);
    return [
        {
            type: 'jsx',
            value: `<CypressConfigFileTabs>\n`,
        },
        {
            type: node.type,
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
