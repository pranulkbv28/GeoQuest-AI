import { GameMode } from "../../../common/enums/game-mode.enum";
import { GameStatus } from "../../../common/enums/game-status.enum";

export class Game {
  gameId!: string;
  gameStatus!: GameStatus;
  gameMode!: GameMode;
  createdAt!: string;
}
