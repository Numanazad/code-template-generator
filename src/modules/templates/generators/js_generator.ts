import { GenerateInput, LanguageGenerator, TypeAst } from './base_generator';


export class JsGenerator implements LanguageGenerator {
languageId() { return 'javascript' as const; }


mapType(t: TypeAst): string {
    switch (t.kind) {
        case 'primitive': return 'any';
        case 'array':
        case 'list': return `${this.mapType(t.elem!)}[]`;
        case 'tree': return 'TreeNode | null';
        case 'graph': return 'Record<number, number[]>';
    }
}


private renderParams(params: GenerateInput['params']): string {
    return params.map(p => p.name).join(', ');
}


generate(input: GenerateInput): string {
        const helpers = `class TreeNode {\n constructor(val=0, left=null, right=null){ this.val=val; this.left=left; this.right=right; }\n}\n`;


        const solution = `class Solution {\n ${input.functionName}(${this.renderParams(input.params)}) {\n // TODO: write your logic here\n throw new Error('Not implemented');\n }\n}\n`;


        const io = `const fs=require('fs');\nconst raw=fs.readFileSync(0,'utf8')||'{}';\nconst data=JSON.parse(raw);\n${input.params.map(p => `const ${p.name} = data['${p.name}'];`).join('\n')}\nconst res = new Solution().${input.functionName}(${input.params.map(p => p.name).join(', ')});\nconsole.log(JSON.stringify(res));\n`;


        return [helpers, solution, io].join('\n');
    }
}