import { db, Prisma } from '@geoquest-ai/database';
import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionDto } from './dto/question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionMapper } from './mapper/question.mapper';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionMapper: QuestionMapper) {}

  private readonly questionsInclude = {
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
  };
  private readonly questionsOmit = {
    categoryId: true,
    countryId: true,
  };

  async findAll(): Promise<{
    questions: QuestionDto[];
    count: number;
  }> {
    const questions = await db.question.findMany({
      where: {
        deletedAt: null,
      },
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    return {
      questions: questions.map((question) =>
        this.questionMapper.toDto(question),
      ),
      count: questions.length,
    };
  }

  async findById(id: string): Promise<QuestionDto> {
    const question = await db.question.findUnique({
      where: {
        id,
      },
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    if (!question) {
      throw new NotFoundException({
        status: 404,
        error: 'QuestionNotFound',
        message: 'The specified question could not be located in our database.',
      });
    }

    if (question.deletedAt) {
      throw new GoneException({
        status: 410,

        error: 'QuestionDeleted',

        message: 'The specified question has been deleted.',
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
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    return {
      questions: questions.map((question) =>
        this.questionMapper.toDto(question),
      ),
      count: questions.length,
    };
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionDto> {
    console.log('Entering inside service');

    const category = await db.category.findUnique({
      where: {
        categorySlug: createQuestionDto.categorySlug,
      },
    });

    if (!category) {
      throw new NotFoundException({
        status: 404,
        error: 'CategoryNotFound',
        message: 'The specified category could not be located in our database.',
      });
    }

    let country = null;
    if (createQuestionDto.isoCode) {
      country = await db.country.findUnique({
        where: {
          isoCode: createQuestionDto.isoCode,
        },
      });

      if (!country) {
        throw new NotFoundException({
          status: 404,
          error: 'CountryNotFound',
          message:
            'The specified country could not be located in our database.',
        });
      }
    }

    const existingDuplicateQuestion = await db.question.findFirst({
      where: {
        question: createQuestionDto.question,
        categoryId: category.id,
        countryId: country?.id ?? null,
        deletedAt: null,
      },
    });

    if (existingDuplicateQuestion) {
      throw new ConflictException({
        status: 409,
        error: 'DuplicateQuestion',
        message:
          'A question with the same text already exists for this category and country.',
      });
    }

    const question = await db.question.create({
      data: {
        categoryId: category.id,
        countryId: country !== null ? country.id : null,
        question: createQuestionDto.question,
        questionImageUrl: createQuestionDto.questionImageUrl ?? null,
        questionType: createQuestionDto.questionType,
        options: createQuestionDto.options,
        answer: createQuestionDto.answer,
        explanation: createQuestionDto.explanation ?? null,
      },
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    return this.questionMapper.toDto(question);
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    const existingQuestion = await db.question.findUnique({
      where: {
        id,
      },
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    if (!existingQuestion) {
      throw new NotFoundException({
        status: 404,
        error: 'QuestionNotFound',
        message: 'The specified question could not be located in our database.',
      });
    }

    let categoryId = existingQuestion.categoryId;

    if (updateQuestionDto.categorySlug) {
      const category = await db.category.findUnique({
        where: {
          categorySlug: updateQuestionDto.categorySlug,
        },
      });

      if (!category) {
        throw new NotFoundException({
          status: 404,

          error: 'CategoryNotFound',

          message:
            'The specified category could not be located in our database.',
        });
      }

      categoryId = category.id;
    }

    let countryId = existingQuestion.countryId;

    if (updateQuestionDto.isoCode === null) {
      // Remove the country association

      countryId = null;
    } else if (updateQuestionDto.isoCode !== undefined) {
      // Associate with a new country

      const country = await db.country.findUnique({
        where: {
          isoCode: updateQuestionDto.isoCode,
        },
      });

      if (!country) {
        throw new NotFoundException({
          status: 404,
          error: 'CountryNotFound',
          message:
            'The specified country could not be located in our database.',
        });
      }

      countryId = country.id;
    }

    const data: Prisma.QuestionUpdateInput = {};

    if (updateQuestionDto.question !== undefined) {
      data.question = updateQuestionDto.question;
    }
    if (updateQuestionDto.questionImageUrl !== undefined) {
      data.questionImageUrl = updateQuestionDto.questionImageUrl;
    }
    if (updateQuestionDto.questionType !== undefined) {
      data.questionType = updateQuestionDto.questionType;
    }
    if (updateQuestionDto.options !== undefined) {
      data.options = updateQuestionDto.options;
    }
    if (updateQuestionDto.answer !== undefined) {
      data.answer = updateQuestionDto.answer;
    }
    if (updateQuestionDto.explanation !== undefined) {
      data.explanation = updateQuestionDto.explanation;
    }
    data.category = {
      connect: {
        id: categoryId,
      },
    };
    data.country =
      countryId === null
        ? {
            disconnect: true,
          }
        : {
            connect: {
              id: countryId,
            },
          };

    const finalQuestion =
      updateQuestionDto.question !== undefined
        ? updateQuestionDto.question
        : existingQuestion.question;

    const existingDuplicateQuestion = await db.question.findFirst({
      where: {
        id: {
          not: id,
        },
        question: finalQuestion,
        categoryId,
        countryId,
        deletedAt: null,
      },
    });

    if (existingDuplicateQuestion) {
      throw new ConflictException({
        status: 409,
        error: 'DuplicateQuestion',
        message:
          'A question with the same text already exists for this category and country.',
      });
    }

    const question = await db.question.update({
      where: {
        id,
      },
      data,
      include: this.questionsInclude,
      omit: this.questionsOmit,
    });

    return this.questionMapper.toDto(question);
  }

  async remove(id: string): Promise<void> {
    const question = await db.question.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    if (!question) {
      throw new NotFoundException({
        status: 404,
        error: 'QuestionNotFound',
        message: 'The specified question could not be located in our database.',
      });
    }

    await db.question.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
