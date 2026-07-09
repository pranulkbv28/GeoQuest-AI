import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

console.log('Inside module');

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
