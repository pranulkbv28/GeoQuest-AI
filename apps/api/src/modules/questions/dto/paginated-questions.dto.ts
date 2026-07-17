export class PaginatedQuestionsDto {
    questions!: QuestionDto[];
    page!: number;
    pageSize!: number;
    totalItems!: number;
    totalPages!: number;
  }