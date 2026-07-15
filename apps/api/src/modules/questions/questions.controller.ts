import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';

@Controller({
  path: 'questions',
  version: '1',
})
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.questionsService.findById(id);
  }

  @Get('category/:slug')
  findByCategory(@Param('slug') slug: string) {
    return this.questionsService.findByCategory(slug);
  }

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }
}
