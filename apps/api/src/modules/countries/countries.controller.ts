import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller({
  path: 'countries',
  version: '1',
})
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    console.log('Hitting Controller');
    return this.countriesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.countriesService.findById(id);
  }
}
