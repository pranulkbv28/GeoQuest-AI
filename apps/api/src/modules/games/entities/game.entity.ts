import { GameMode } from "../../../common/enums/game-mode.enum";
import { GameStatus } from "../../../common/enums/game-status.enum";
import { Country } from "./country.entity";

export class Game {
  gameId!: string;
  gameStatus!: GameStatus;
  gameMode!: GameMode;
  createdAt!: string;
  countries!: Country[];
}
