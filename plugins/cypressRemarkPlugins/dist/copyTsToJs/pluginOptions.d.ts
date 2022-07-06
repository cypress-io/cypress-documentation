import { Options } from 'prettier';
import { CompilerOptions } from 'typescript';
export interface PluginOptions {
    prettierOptions?: Options;
    typescriptCompilerOptions?: CompilerOptions;
}
