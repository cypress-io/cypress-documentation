import prettier, { Options } from 'prettier'
import ts, { CompilerOptions } from 'typescript'
import { PluginOptions } from './pluginOptions'
import { transformEsmToCjs } from './transformEsmToCjs'

export async function transformTsToJs(code: string, options: PluginOptions) {
  const tsCode = escapeNewLines(code)
  const esmCode = tsToEsm(tsCode, options).outputText

  const prettyTsCode = (
    await prettier.format(
      restoreNewLines(tsCode),
      makePrettierOptions(options.prettierOptions),
    )
  ).slice(0, -1)

  const cjsCode = transformEsmToCjs(esmCode)
  const prettyCjsCode = (
    await prettier.format(
      restoreNewLines(cjsCode),
      makePrettierOptions(options.prettierOptions),
    )
  ).slice(0, -1)

  return {
    tsCode: prettyTsCode,
    jsCode: prettyCjsCode,
  }
}

function makeTsCompilerOptions(
  overrideOptions?: CompilerOptions,
): CompilerOptions {
  return {
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
    esModuleInterop: false,
    pretty: true,
    ...overrideOptions,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ESNext,
  }
}

function makePrettierOptions(overrideOptions?: Options): Options {
  return {
    parser: 'babel',
    semi: false,
    printWidth: 80,
    singleQuote: true,
    ...overrideOptions,
  }
}

/**
 * TS compiler strips out new lines, so we do this hack to keep them
 */
function escapeNewLines(code: string) {
  return code.replace(/\n\n/g, '\n/* :newline: */\n')
}

function restoreNewLines(code: string): string {
  return code.replace(/\/\* :newline: \*\//g, '\n\n')
}

function tsToEsm(code: string, options: PluginOptions): ts.TranspileOutput {
  return ts.transpileModule(code, {
    reportDiagnostics: false,
    compilerOptions: makeTsCompilerOptions(options.typescriptCompilerOptions),
  })
}
