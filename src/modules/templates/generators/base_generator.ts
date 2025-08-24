export type DslKind = 'primitive' | 'array' | 'list' | 'tree' | 'graph';


export interface TypeAst {
    kind: DslKind;
    name?: string;
    elem?: TypeAst;
}


export interface ParameterModel {
    name: string;
    type: TypeAst;
}


export type ReturnsModel = { multi: false; type: TypeAst } | { multi: true; types: { name?: string; type: TypeAst }[] };


export interface GenerateInput {
    title: string;
    functionName: string;
    params: ParameterModel[];
    returns: ReturnsModel;
}


export interface LanguageGenerator {
    languageId(): 'python' | 'javascript' | 'java' | 'cpp';
    mapType(t: TypeAst, ctx?: { forParam?: boolean }): string;
    generate(input: GenerateInput): string;
}


export class DslParser {
    private pos = 0;
    constructor(private s: string) {}


    static parse(s: string): TypeAst {
        return new DslParser(s.replace(/\s+/g, '')).type();
    }


    private peek() { return this.s[this.pos]; }
    private eat(ch: string) { if (this.s[this.pos] !== ch) throw new Error(`Expected '${ch}' at ${this.pos}`); this.pos++; }
    private readIdent(): string {
        const start = this.pos;
        while (this.pos < this.s.length && /[A-Za-z0-9_]/.test(this.s[this.pos])) this.pos++;
        return this.s.slice(start, this.pos);
    }


    private type(): TypeAst {
        const ident = this.readIdent();
        if (!ident) throw new Error('Type expected');


        if (ident === 'List') {
            this.eat('<');
            const inner = this.type();
            this.eat('>');
            return { kind: 'list', elem: inner };
        }


        if (ident === 'Tree') {
            this.eat('<');
            const inner = this.type();
        }

        if (ident === 'Graph') {
            return { kind: 'graph' };
        }
        
        
        let node: TypeAst = { kind: 'primitive', name: ident };
        while (this.peek() === '[') {
            this.eat('['); this.eat(']');
            node = { kind: 'array', elem: node };
        }
        return node;
    }
}