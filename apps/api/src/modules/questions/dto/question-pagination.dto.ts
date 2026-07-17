import { QuestionType } from '@geoquest-ai/database';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QuestionSortBy } from '../enums/question-sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';

export class QuestionPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  isoCode?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType!: QuestionType;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  search!: string;

  @IsOptional()
  @IsEnum(QuestionSortBy)
  sortBy: QuestionSortBy = QuestionSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}
