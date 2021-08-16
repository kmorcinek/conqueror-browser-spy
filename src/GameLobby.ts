import { GameLobbyClicker } from "./GameLobbyClicker";

export class GameLobby {
  readonly clicker: GameLobbyClicker = new GameLobbyClicker();
  isQuiting = false;

  startNewAiGame() {
    this.clicker.clickMultiplayer();
    this.clicker.clickCreateGame();
    window.setTimeout(() => {
      this.clicker.clickStartGame();
    }, 1000);
  }

  quitGameAfterSound() {
    if (this.isQuiting) {
      return;
    }

    this.isQuiting = true;
    window.setTimeout(() => {
      this.clicker.clickQuitGame();
      // maybe also delay
      window.setTimeout(() => {
        this.clicker.confirmQuit();
        this.isQuiting = false;
      }, 1000);
    }, 5000);
  }
}
