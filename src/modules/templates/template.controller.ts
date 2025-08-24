import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TemplateRequestDto } from './dto/template_request.dto';
import { TemplateService } from './template.service';


@Controller()
export class TemplateController {
constructor(private readonly svc: TemplateService) {}


@Post('template')
@HttpCode(HttpStatus.CREATED)
create(@Body() body: TemplateRequestDto) {
    return this.svc.generate(body);
}
}