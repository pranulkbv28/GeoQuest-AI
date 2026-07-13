import { db } from '@geoquest-ai/database';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CountriesService {
  async findAll() {
    const countries = await db.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      countries,
      count: countries.length,
    };
  }

  async findById(id: string) {
    // will be building an enitity here and use it later on
    const country = await db.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException({
        status: 404,
        error: 'CountryNotFound',
        message: 'The specified country could not be located in our database.',
      });
    }

    return country;
  }
}
