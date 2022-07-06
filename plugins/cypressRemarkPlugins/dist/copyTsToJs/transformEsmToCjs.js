"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformEsmToCjs = void 0;
/**
 * A fairly naive approach to replacing esm imports/exports with
 * cjs requires/module.exports. Might not work for all situations but hopefully
 * enough for our docs.
 */
const transformEsmToCjs = (code) => {
    let result = convertImports(code);
    result = convertExports(result);
    return result;
};
exports.transformEsmToCjs = transformEsmToCjs;
const convertImports = (code) => {
    const importRegEx = /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/gm;
    let matches = code.matchAll(importRegEx);
    for (const match of matches) {
        let newLine = '';
        if (match[1]) {
            newLine = `const ${match[1].trim()} = require('${match[2].trim()}')`;
        }
        else {
            newLine = `require('${match[2].trim()}')`;
        }
        code = code.replace(match[0], newLine);
    }
    return code;
};
function convertExports(code) {
    const exportDefaultRegex = /^export default /gm;
    let result = code.replace(exportDefaultRegex, 'module.exports = ');
    const exportRegex = /^export const /gm;
    result = result.replace(exportRegex, 'module.exports.');
    return result;
}
