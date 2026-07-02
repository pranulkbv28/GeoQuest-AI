import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";
import { PlacesService } from "./places.service";

@Controller({
  path: "places",
  version: "1",
})
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.placesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(+id, updatePlaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.placesService.remove(+id);
  }
}
