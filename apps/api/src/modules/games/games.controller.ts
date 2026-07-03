import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { GamesService } from "./games.service";

@Controller({
  path: "games",
  version: "1",
})
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gamesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Post(":id/start")
  start(@Param("id") id: string) {
    return this.gamesService.start(id);
  }
}
