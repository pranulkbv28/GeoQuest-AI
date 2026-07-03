import { IsEnum } from "class-validator";
import { GameMode } from "../../../common/enums/game-mode.enum";

export class CreateGameDto {
  @IsEnum(GameMode)
  gameMode!: GameMode;
}
