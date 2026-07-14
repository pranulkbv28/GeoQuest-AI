import { QuestionCategoryDto } from './question-category.dto';
import { QuestionCountryDto } from './question-country.dto';

export class QuestionDto {
  id!: string;
  question!: string;
  questionImageUrl!: string | null;
  questionType!: string;
  options!: string[] | null;

  category!: QuestionCategoryDto;
  country!: QuestionCountryDto | null;
}
