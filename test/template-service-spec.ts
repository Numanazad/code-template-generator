import { Test } from '@nestjs/testing';
import { TemplateService } from '../src/modules/templates/template.service';
import { TemplateModule } from '../src/modules/templates/template.module';


const baseReq = {
question_id: 'two-sum',
title: 'Two Sum',
description: 'Given an integer array…',
signature: {
function_name: 'twoSum',
parameters: [
{ name: 'nums', type: 'int[]' },
{ name: 'target', type: 'int' },
],
returns: { type: 'int[]' },
},
};

describe('TemplateService', () => {
    let svc: TemplateService;
    
    
    beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [TemplateModule] }).compile();
    svc = mod.get(TemplateService);
    });

    it('generates C++', () => {
        const out = svc.generate({ ...baseReq, language: 'cpp' } as any);
        expect(out.template).toContain('struct Solution');
        expect(out.template).toContain('int main()');
    });

    it('validates DSL input', () => {
        expect(() => svc.generate({ ...baseReq, signature: {
            function_name: 'twoSum',
            parameters: [{ name: 'nums', type: 'int[]' }],
            returns: { type: 'int[]' },
        } } as any)).toThrow();
    });
});