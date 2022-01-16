export class OneGameStatistics {
  readonly isMyWin: boolean;
  readonly turnsTaken: number;

  constructor(isMyWin: boolean, turnsTaken: number) {
    this.isMyWin = isMyWin;
    this.turnsTaken = turnsTaken;
  }
}
