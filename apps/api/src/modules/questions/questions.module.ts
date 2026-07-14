import { Module } from '@nestjs/common';
import { QuestionMapper } from './mapper/question.mapper';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionMapper],
})
export class QuestionsModule {}
