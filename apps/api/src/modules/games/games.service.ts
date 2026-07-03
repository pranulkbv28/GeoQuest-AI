import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GameStatus } from "../../common/enums/game-status.enum";
import { CreateGameDto } from "./dto/create-game.dto";
import { Game } from "./entities/game.entity";

@Injectable()
export class GamesService {
  private readonly games: Game[] = [];

  create(createGameDto: CreateGameDto): Game {
    const newGame: Game = {
      gameId: randomUUID(),
      gameMode: createGameDto.gameMode,
      gameStatus: GameStatus.CREATED,
      createdAt: new Date().toISOString(),
    };

    this.games.push(newGame);

    return newGame;
  }

  findOne(id: string): Game | { message: string } {
    const foundGame = this.games.find((game) => game.gameId === id);

    if (!foundGame) {
      return {
        message: `No game found with id: ${id}`,
      };
    }

    return foundGame;
  }

  findAll(): { games: Game[]; count: number } {
    return {
      games: this.games,
      count: this.games.length,
    };
  }
}
