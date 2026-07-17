import { QuestionDto } from './question.dto';

export class PaginatedQuestionsDto {
  questions!: QuestionDto[];
  page!: number;
  pageSize!: number;
  totalItems!: number;
  totalPages!: number;
}
