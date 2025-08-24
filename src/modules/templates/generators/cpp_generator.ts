import { LanguageGenerator, TypeAst, GenerateInput } from "./base_generator";


export class CppGenerator implements LanguageGenerator {
languageId() { return 'cpp' as const; }


mapType(t: TypeAst): string {
    switch (t.kind) {
    case 'primitive':
    switch (t.name) {
    case 'int': return 'int';
    case 'long': return 'long long';
    case 'float': return 'float';
    case 'double': return 'double';
    case 'bool': return 'bool';
    case 'string': return 'std::string';
    default: return 'auto';
    }
    case 'array':
    case 'list': return `std::vector<${this.mapType(t.elem!)}>`;
    case 'tree': return 'TreeNode*';
    case 'graph': return 'std::unordered_map<int, std::vector<int>>';
    }
}


private renderParams(params: GenerateInput['params']): string {
    return params.map(p => `${this.mapType(p.type)} ${p.name}`).join(', ');
}


generate(input: GenerateInput): string {
    const helpers = `#include <bits/stdc++.h>\nstruct TreeNode{int val;TreeNode*left;TreeNode*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};\n`;


    const solution = `struct Solution{\n ${this.mapType((input.returns as any).type ?? {kind:'primitive', name:'void'})} ${input.functionName}(${this.renderParams(input.params)}){\n // TODO: write your logic here\n throw std::logic_error(\"Not implemented\");\n }\n};\n`;


    const io = `int main(){\n std::ios::sync_with_stdio(false); std::cin.tie(nullptr);\n // JSON parsing intentionally omitted to keep template header‑only.\n std::cout << \"IO hidden by platform\\n\";\n return 0;\n}\n`;


    return [helpers, solution, io].join('\n');
}
}