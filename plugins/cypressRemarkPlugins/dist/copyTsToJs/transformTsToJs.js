"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTsToJs = void 0;
const prettier_1 = __importDefault(require("prettier"));
const typescript_1 = __importDefault(require("typescript"));
const transformEsmToCjs_1 = require("./transformEsmToCjs");
function transformTsToJs(code, options) {
    const tsCode = escapeNewLines(code);
    const esmCode = tsToEsm(tsCode, options).outputText;
    const prettyTsCode = prettier_1.default
        .format(restoreNewLines(tsCode), makePrettierOptions(options.prettierOptions))
        .slice(0, -1);
    const cjsCode = (0, transformEsmToCjs_1.transformEsmToCjs)(esmCode);
    const prettyCjsCode = prettier_1.default
        .format(restoreNewLines(cjsCode), makePrettierOptions(options.prettierOptions))
        .slice(0, -1);
    return {
        tsCode: prettyTsCode,
        jsCode: prettyCjsCode,
    };
}
exports.transformTsToJs = transformTsToJs;
function makeTsCompilerOptions(overrideOptions) {
    return Object.assign(Object.assign({ newLine: typescript_1.default.NewLineKind.LineFeed, removeComments: false, esModuleInterop: false, pretty: true }, overrideOptions), { module: typescript_1.default.ModuleKind.ESNext, moduleResolution: typescript_1.default.ModuleResolutionKind.NodeJs, target: typescript_1.default.ScriptTarget.ESNext });
}
function makePrettierOptions(overrideOptions) {
    return Object.assign({ parser: 'babel', semi: false, printWidth: 80, singleQuote: true }, overrideOptions);
}
/**
 * TS compiler strips out new lines, so we do this hack to keep them
 */
function escapeNewLines(code) {
    return code.replace(/\n\n/g, '\n/* :newline: */\n');
}
function restoreNewLines(code) {
    return code.replace(/\/\* :newline: \*\//g, '\n\n');
}
function tsToEsm(code, options) {
    return typescript_1.default.transpileModule(code, {
        reportDiagnostics: false,
        compilerOptions: makeTsCompilerOptions(options.typescriptCompilerOptions),
    });
}
