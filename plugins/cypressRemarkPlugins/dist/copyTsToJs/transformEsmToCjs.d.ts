/**
 * A fairly naive approach to replacing esm imports/exports with
 * cjs requires/module.exports. Might not work for all situations but hopefully
 * enough for our docs.
 */
export declare const transformEsmToCjs: (code: string) => string;
