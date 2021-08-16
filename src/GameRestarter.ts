import { GameRestarterClicker } from "./GameRestarterClicker";

export class GameRestarter {
  readonly clicker: GameRestarterClicker = new GameRestarterClicker();
  isExiting = false;
  isRestartGame = false;

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
    window.setTimeout(() => {
      this.clicker.clickExitGame();
      // maybe also delay
      window.setTimeout(() => {
        this.clicker.confirmExit();
        this.isExiting = false;
      }, 1000);
    }, 5000);
  }
}
