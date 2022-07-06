"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyTsToJs = void 0;
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const transformTsToJs_1 = require("./transformTsToJs");
function copyTsToJs({ prettierOptions = {}, typescriptCompilerOptions = {} } = {
    prettierOptions: {},
    typescriptCompilerOptions: {},
}) {
    return (root) => {
        (0, unist_util_visit_1.default)(root, (node) => {
            if (isParent(node)) {
                let index = 0;
                while (index < node.children.length) {
                    const child = node.children[index];
                    if (matchNode(child)) {
                        const result = transformNode(child, {
                            prettierOptions,
                            typescriptCompilerOptions,
                        });
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
exports.copyTsToJs = copyTsToJs;
function isParent(node) {
    return Array.isArray(node.children);
}
function matchNode(node) {
    var _a;
    return (node.type === 'code' &&
        typeof node.meta === 'string' &&
        ((_a = node.meta) !== null && _a !== void 0 ? _a : '').startsWith('copyTsToJs'));
}
function transformNode(node, options) {
    const { tsCode, jsCode } = (0, transformTsToJs_1.transformTsToJs)(node.value, options);
    return [
        {
            type: node.type,
            lang: 'js',
            meta: node.meta,
            value: jsCode,
        },
        {
            type: node.type,
            lang: node.lang,
            meta: node.meta,
            value: tsCode,
        },
    ];
}
