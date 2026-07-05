import { Module } from "@nestjs/common";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { CountrySelectionService } from "./services/country-selection.service";

@Module({
  controllers: [GamesController],
  providers: [GamesService, CountrySelectionService],
})
export class GamesModule {}
