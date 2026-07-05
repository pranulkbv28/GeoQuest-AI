import { Injectable } from "@nestjs/common";
import { Country } from "../entities/country.entity";

@Injectable()
export class CountrySelectionService {
  private readonly countries: Country[] = [
    {
      id: "1",
      name: "India",
    },
    {
      id: "2",
      name: "China",
    },
    {
      id: "3",
      name: "Russia",
    },
    {
      id: "4",
      name: "United States of America",
    },
    {
      id: "5",
      name: "Sri Lanka",
    },
    {
      id: "6",
      name: "Australia",
    },
    {
      id: "7",
      name: "South Africa",
    },
    {
      id: "8",
      name: "Ireland",
    },
    {
      id: "9",
      name: "Netherlands",
    },
    {
      id: "10",
      name: "United Kingdom",
    },
  ];

  generateBatch(): Country[] {
    return this.countries;
  }
}
