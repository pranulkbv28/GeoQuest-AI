import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('byID/:id')
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Get('ByName/:name')
  findByName(@Param('name') name: string) {
    return this.categoriesService.findByName(name);
  }
}
