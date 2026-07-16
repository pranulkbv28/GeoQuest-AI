import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUppercase } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, ['isoCode'] as const),
) {
  @IsOptional()
  @IsString()
  @IsUppercase()
  isoCode?: string | null;
}
