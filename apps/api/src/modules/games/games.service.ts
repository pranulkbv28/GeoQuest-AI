import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GameStatus } from "../../common/enums/game-status.enum";
import { CreateGameDto } from "./dto/create-game.dto";
import { Game } from "./entities/game.entity";

@Injectable()
export class GamesService {
  private readonly games: Game[] = [];

  /**
   * Post /games
   */
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

  /**
   * Internal helper used by other service methods.
   */
  private findGame(id: string): Game | undefined {
    return this.games.find((game) => game.gameId === id);
  }

  /**
   * GET /games/:id
   */
  findOne(id: string): Game | { message: string } {
    const game = this.findGame(id);

    if (!game) {
      return {
        message: `No game found with id: ${id}`,
      };
    }

    return game;
  }

  /**
   * GET /games
   */
  findAll(): { games: Game[]; count: number } {
    return {
      games: this.games,

      count: this.games.length,
    };
  }

  /**
   * POST /games/:id/start
   */
  start(id: string): Game | { message: string } {
    const game = this.findGame(id);

    if (!game) {
      return {
        message: `No game found with id: ${id}`,
      };
    }

    if (game.gameStatus !== GameStatus.CREATED) {
      return {
        message: `Game is currently '${game.gameStatus}' and cannot be started.`,
      };
    }

    // Transition the game to READY before all initialization succeeds.
    game.gameStatus = GameStatus.READY;

    // TODO(GameService): CountrySelectionService.generateBatch(game)
    // TODO(GameService): BoardGenerationService.generateBoard(game)
    // TODO(GameService): TurnService.initializeFirstTurn(game)

    // Transition the game to STARTED only after all initialization succeeds.
    game.gameStatus = GameStatus.STARTED;

    return game;
  }
}
