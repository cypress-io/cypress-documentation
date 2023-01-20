declare module 'esm-to-cjs' {
  interface RunTransformOptions {
    quote?: 'single' | 'double'
    lenDestructure?: number
    lenModuleName?: number
    lenIdentifier?: number
    indent?: number
  }

  function runTransform(code: string, options: RunTransformOptions): string

  export { runTransform }
}
