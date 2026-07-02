import { Injectable } from "@nestjs/common";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";

@Injectable()
export class PlacesService {
  private readonly places = [
    {
      id: 1,
      name: "Cubbon Park",
      city: "Bengaluru",
      category: "Park",
    },
    {
      id: 2,
      name: "Lalbagh Botanical Garden",
      city: "Bengaluru",
      category: "Garden",
    },
    {
      id: 3,
      name: "Mysore Palace",
      city: "Mysuru",
      category: "Palace",
    },
  ];

  create(createPlaceDto: CreatePlaceDto) {
    return "This action adds a new place";
  }

  findAll() {
    return this.places;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
