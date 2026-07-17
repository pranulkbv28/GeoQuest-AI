import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionPaginationDto } from './dto/question-pagination.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

@Controller({
  path: 'questions',
  version: '1',
})
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll(@Query() paginationDto: QuestionPaginationDto) {
    return this.questionsService.findAll(paginationDto);
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
