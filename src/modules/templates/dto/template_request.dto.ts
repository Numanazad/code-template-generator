import { Type } from 'class-transformer';
import {
ArrayMinSize,
IsArray,
IsIn,
IsNotEmpty,
IsOptional,
IsString,
ValidateNested,
} from 'class-validator';


export const SupportedLanguages = ['python', 'javascript', 'java', 'cpp'] as const;
export type SupportedLanguage = typeof SupportedLanguages[number];


export class ParameterDto {
@IsString() @IsNotEmpty()
name!: string;


@IsString() @IsNotEmpty()
type!: string;
}


export class ReturnDto {
@IsString() @IsNotEmpty()
type!: string; // same DSL
}


export class SignatureDto {
@IsString() @IsNotEmpty()
function_name!: string;


@IsArray() @ArrayMinSize(0)
@Type(() => ParameterDto)
@ValidateNested({ each: true })
parameters!: ParameterDto[];


@IsOptional()
@Type(() => ReturnDto)
returns?: any;
}


export class TemplateRequestDto {
@IsString() @IsNotEmpty()
question_id!: string;


@IsString() @IsNotEmpty()
title!: string;


@IsString() @IsNotEmpty()
description!: string;


@Type(() => SignatureDto)
@ValidateNested()
signature!: SignatureDto;


@IsIn(SupportedLanguages as any)
language!: SupportedLanguage;
}