import { db } from '@geoquest-ai/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionMapper } from './mapper/question.mapper';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionMapper: QuestionMapper) {}

  async findAll(): Promise<{
    questions: QuestionDto[];
    count: number;
  }> {
    const questions = await db.question.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        category: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        country: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        categoryId: true,
        countryId: true,
        deletedAt: true,
      },
    });

    return {
      questions: questions.map((question) =>
        this.questionMapper.toDto(question),
      ),
      count: questions.length,
    };
  }

  async findById(id: string): Promise<QuestionDto> {
    const question = await db.question.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        country: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        categoryId: true,
        countryId: true,
        deletedAt: true,
      },
    });

    if (!question) {
      throw new NotFoundException({
        status: 404,
        error: 'QuestionNotFound',
        message: 'The specified question could not be located in our database.',
      });
    }

    return this.questionMapper.toDto(question);
  }

  async findByCategory(categorySlug: string): Promise<{
    questions: QuestionDto[];
    count: number;
  }> {
    const category = await db.category.findUnique({
      where: {
        categorySlug,
      },
    });

    if (!category) {
      throw new NotFoundException({
        status: 404,
        error: 'CategoryNotFound',
        message: 'The specified category could not be located in our database.',
      });
    }

    const questions = await db.question.findMany({
      where: {
        category: {
          categorySlug,
        },
        deletedAt: null,
      },
      include: {
        category: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        country: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        categoryId: true,
        countryId: true,
        deletedAt: true,
      },
    });

    return {
      questions: questions.map((question) =>
        this.questionMapper.toDto(question),
      ),
      count: questions.length,
    };
  }
}
