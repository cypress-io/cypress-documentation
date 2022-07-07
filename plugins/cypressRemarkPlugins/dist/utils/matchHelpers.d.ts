import type { Code } from 'mdast';
import type { Node, Parent } from 'unist';
export declare function isMatchedDirective(node: Node, tagName: string): node is Parent;
export declare function isCode(node: Node): node is Code & Parent;
