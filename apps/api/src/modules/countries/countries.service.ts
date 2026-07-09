import { db } from '@geoquest-ai/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CountriesService {
  async findAll() {
    const countries = await db.country.findMany();

    if (countries.length == 0) {
      return {
        countries: [],
        message: 'No countries found',
      };
    }

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
      return {
        message: `No such country with id: ${id}`,
      };
    }

    return country;
  }
}
