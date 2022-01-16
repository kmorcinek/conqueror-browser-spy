import { GameRestarterClicker } from "./GameRestarterClicker";
import { Statistics } from "./statistics/Statistics";

export class GameRestarter {
  readonly clicker: GameRestarterClicker = new GameRestarterClicker();
  readonly statistics: Statistics;

  isExiting = false;
  isRestartGame = false;

  constructor(statistics: Statistics) {
    this.statistics = statistics;
  }

  changeRestartNewGame(state: boolean) {
    this.isRestartGame = state;
  }

  getRestartNewGame(): boolean {
    return this.isRestartGame;
  }

  startNewAiGame() {
    if (!this.isRestartGame) {
      return;
    }

    this.clicker.clickMultiplayer();
    this.clicker.clickCreateGame();
    window.setTimeout(() => {
      this.clicker.clickStartGame();
    }, 1000);
  }

  exitGameAfterSound() {
    if (!this.isRestartGame) {
      return;
    }

    if (this.isExiting) {
      return;
    }

    this.isExiting = true;

    this.statistics.writeResult();

    window.setTimeout(() => {
      this.clicker.clickExitGame();
      // maybe also delay
      window.setTimeout(() => {
        this.clicker.confirmExit();
        this.isExiting = false;
      }, 200);
    }, 2000);
  }
}
