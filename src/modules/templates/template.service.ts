import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateRequestDto } from './dto/template_request.dto';
import { CppGenerator } from './generators/cpp_generator';
import { GenerateInput, LanguageGenerator, ParameterModel, ReturnsModel, TypeAst, DslParser } from './generators/base_generator';

@Injectable()
export class TemplateService {
private generators: Record<string, LanguageGenerator> = {
    cpp: new CppGenerator(),
};


generate(dto: TemplateRequestDto) {
    const g = this.generators[dto.language];
    if (!g) throw new BadRequestException(`Unsupported language: ${dto.language}`);


    const params: ParameterModel[] = dto.signature.parameters.map(p => ({
    name: p.name,
    type: this.parseTypeOrThrow(p.type, `parameters.${p.name}`),
    }));


    const returns: ReturnsModel = this.normalizeReturns(dto.signature.returns);


    const input: GenerateInput = {
    title: dto.title,
    functionName: dto.signature.function_name,
    params,
    returns,
    };


    const template = g.generate(input);
    return { language: dto.language, template };
}


private normalizeReturns(ret: any): ReturnsModel {
    if (!ret) return { multi: false, type: { kind: 'primitive', name: 'void' } } as any;
    if (Array.isArray(ret)) {
    const types = ret.map((r, idx) => ({ name: r?.name, type: this.parseTypeOrThrow(r?.type, `returns[${idx}]`) }));
    if (types.length === 0) throw new BadRequestException(`returns[] must not be empty`);
    return { multi: true, types };
    }
    if (typeof ret === 'object' && typeof ret.type === 'string') {
    return { multi: false, type: this.parseTypeOrThrow(ret.type, 'returns') };
    }
    throw new BadRequestException(`Invalid 'returns' shape. Use { type: string } or array of { name?, type }.`);
}

private parseTypeOrThrow(s: string, where: string): TypeAst {
    try {
    return DslParser.parse(s);
    } catch (e: any) {
    throw new BadRequestException(`Invalid type at ${where}: ${e.message}`);
    }
}

}