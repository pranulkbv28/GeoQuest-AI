import { Prisma } from '@geoquest-ai/database';
import { Injectable } from '@nestjs/common';
import { QuestionDto } from '../dto/question.dto';

type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: {
    category: {
      omit: {
        createdAt: true;
        updatedAt: true;
      };
    };
    country: {
      omit: {
        createdAt: true;
        updatedAt: true;
      };
    };
  };
  omit: {
    categoryId: true;
    countryId: true;
    deletedAt: true;
  };
}>;

@Injectable()
export class QuestionMapper {
  toDto(question: QuestionWithRelations): QuestionDto {
    return {
      id: question.id,
      question: question.question,
      questionImageUrl: question.questionImageUrl,
      questionType: question.questionType,
      options: question.options,
      category: {
        id: question.category.id,
        name: question.category.name,
        categorySlug: question.category.categorySlug,
      },
      country: question.country
        ? {
            id: question.country.id,
            isoCode: question.country.isoCode,
            name: question.country.name,
          }
        : null,
    };
  }
}
