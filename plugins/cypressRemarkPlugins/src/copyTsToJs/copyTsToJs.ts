// Inspired from
// https://github.com/sapphiredev/documentation-plugins/tree/main/packages/ts2esm2cjs
// and modified for our needs.

import type { Code, Content } from 'mdast'
import type { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { PluginOptions } from './pluginOptions'
import { transformTsToJs } from './transformTsToJs'

export function copyTsToJs(
  { prettierOptions = {}, typescriptCompilerOptions = {} }: PluginOptions = {
    prettierOptions: {},
    typescriptCompilerOptions: {},
  },
) {
  return (root) => {
    visit(root, (node: Node) => {
      if (isParent(node)) {
        let index = 0
        const treatNode = () => {
          if (index >= node.children.length) return

          const child = node.children[index]!
          if (matchNode(child)) {
            transformNode(child, {
              prettierOptions,
              typescriptCompilerOptions,
            }).then((result) => {
              node.children.splice(index, 1, ...result)
              index += result.length
              treatNode()
            })
          } else {
            index += 1
            treatNode()
          }
        }
        treatNode()
      }
    })
  }
}

function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children)
}

function matchNode(node: Node): node is Code & Parent {
  return (
    node.type === 'code' &&
    typeof (node as Code).meta === 'string' &&
    ((node as Code).meta ?? '').startsWith('copyTsToJs')
  )
}

async function transformNode(node: Code, options: PluginOptions) {
  const { tsCode, jsCode } = await transformTsToJs(node.value, options)

  return [
    {
      type: node.type,
      lang: 'js',
      meta: node.meta?.replace('copyTsToJs', ''),
      value: jsCode,
    },
    {
      type: node.type,
      lang: node.lang,
      meta: node.meta?.replace('copyTsToJs', ''),
      value: tsCode,
    },
  ] as Content[]
}
