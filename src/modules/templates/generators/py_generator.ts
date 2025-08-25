import { GenerateInput, LanguageGenerator, TypeAst } from './base_generator';


export class PythonGenerator implements LanguageGenerator {
languageId() { return 'python' as const; }


mapType(t: TypeAst): string {
    switch (t.kind) {
        case 'primitive':
        switch (t.name) {
            case 'int': return 'int';
            case 'long': return 'int';
            case 'float': return 'float';
            case 'double': return 'float';
            case 'bool': return 'bool';
            case 'string': return 'str';
            default: return 'typing.Any';
        }
        case 'array':
        case 'list':
        return `list[${this.mapType(t.elem!)}]`;
        case 'tree':
        return 'TreeNode | None';
        case 'graph':
        return 'dict[int, list[int]]';
    }
}


private renderReturnType(ret: GenerateInput['returns']): string {
    if (!ret.multi) return this.mapType(ret.type);
    const inner = ret.types.map(x => this.mapType(x.type)).join(', ');
    return `tuple[${inner}]`;
}


generate(input: GenerateInput): string {
        const paramsSig = input.params.map(p => `${p.name}: ${this.mapType(p.type)}`).join(', ');
        const returnType = this.renderReturnType(input.returns);


        const helpers = `from __future__ import annotations\nimport sys, json, typing\n\nclass TreeNode:\n def __init__(self, val: typing.Any = 0, left: 'TreeNode|None' = None, right: 'TreeNode|None' = None):\n self.val = val\n self.left = left\n self.right = right\n\n# Utilities hidden from candidates\ndef _build_tree_level(values: list[typing.Any]) -> TreeNode|None:\n if not values: return None\n nodes = [None if v is None else TreeNode(v) for v in values]\n kids = nodes[1:]\n i = 0\n for idx, node in enumerate(nodes):\n if node is not None:\n li = 2*idx+1\n ri = 2*idx+2\n if li < len(nodes): node.left = nodes[li]\n if ri < len(nodes): node.right = nodes[ri]\n return nodes[0]\n\n`;


        const solution = `class Solution:\n def ${input.functionName}(self, ${paramsSig}) -> ${returnType}:\n \"\"\"${input.title}: ${input.functionName}\n ${input.params.map(p => `:param ${p.name}: ${this.mapType(p.type)}`).join('\n ')}\n :return: ${returnType}\n \"\"\"\n # TODO: write your logic here\n raise NotImplementedError()\n\n`;


        const io = `if __name__ == '__main__':\n data = json.loads(sys.stdin.read() or '{}')\n kwargs = {}\n # Basic JSON → typed mapping (extend as needed)\n ${input.params.map(p => `kwargs['${p.name}'] = data.get('${p.name}')`).join('\n ')}\n res = Solution().${input.functionName}(**kwargs)\n print(json.dumps(res))\n`;


        return [helpers, solution, io].join('\n');
    }
}