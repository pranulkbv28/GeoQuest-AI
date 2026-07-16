import { QuestionType } from '@geoquest-ai/database';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  IsUrl,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question!: string;

  @IsString()
  @IsNotEmpty()
  categorySlug!: string;

  @IsOptional()
  @IsString()
  @IsUppercase()
  isoCode?: string;

  @IsOptional()
  @IsUrl()
  questionImageUrl?: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  questionType!: QuestionType;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  options!: string[];

  @IsNotEmpty()
  @IsString()
  answer!: string;

  @IsOptional()
  @IsString()
  explanation?: string;
}
