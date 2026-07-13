import { db } from '@geoquest-ai/database';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  async findAll() {
    const categories = await db.category.findMany();

    return {
      categories,
      count: categories.length,
    };
  }

  async findById(id: string) {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException({
        status: 404,
        error: 'CategoryNotFound',
        message: 'The specified category could not be located in our database.',
      });
    }

    return category;
  }

  async findByName(name: string) {
    const category = await db.category.findUnique({
      where: {
        categoryBlob: name,
      },
    });

    if (!category) {
      throw new NotFoundException({
        status: 404,
        error: 'CategoryNotFound',
        message: 'The specified category could not be located in our database.',
      });
    }

    return category;
  }
}
