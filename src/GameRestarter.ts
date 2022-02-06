import { GameRestarterClicker } from "./GameRestarterClicker";
import { OneGameStatistics } from "./statistics/OneGameStatistics";
import { Statistics } from "./statistics/Statistics";
import { Winner } from "./statistics/Winner";

export class GameRestarter {
  readonly clicker: GameRestarterClicker = new GameRestarterClicker();
  readonly statistics: Statistics;
  readonly winner: Winner;

  isExiting = false;
  isRestartGame = false;

  constructor(statistics: Statistics, winner: Winner) {
    this.statistics = statistics;
    this.winner = winner;
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

  giveUpGame() {
    const statistic = this.winner.getWalkoverGameAgainstMe();
    this.exitGame(statistic);
  }

  exitGameAfterSound() {
    const statistic = this.winner.getStatistic();
    this.exitGame(statistic);
  }

  private exitGame(statistic: OneGameStatistics) {
    if (!this.isRestartGame) {
      return;
    }

    if (this.isExiting) {
      return;
    }

    this.isExiting = true;

    this.statistics.writeResult(statistic);

    window.setTimeout(() => {
      this.clicker.clickExitGame();
      // maybe also delay
      window.setTimeout(() => {
        this.clicker.confirmExit();
        this.isExiting = false;
      }, 700);
    }, 2000);
  }
}
