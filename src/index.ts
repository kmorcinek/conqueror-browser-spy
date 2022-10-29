// import $ from "jquery";
import { Board } from "./red7/Board";
import { Red7 } from "./red7/Red7";
import { Runner } from "./red7/Runner";

export class Red7Spy {
  static runner: Runner;

  static initialize() {
    console.log("initialize conqueror-browser-spy");
    this.constructObjects();

    // ConquerorSpy.hud.hardInitHudWrapper();
    // this.updateRunAi();
    // this.updateAutoEndTurn();
  }

  static start() {
    console.log("Running red7-spy");

    this.runner.giveFirstCardToCanvas();
    // console.log("Tool version: " + Version.getFullVersion());
  }

  private static constructObjects() {
    const red7 = new Red7();
    Red7Spy.runner = new Runner(red7, new Board(red7));
  }
}

try {
  console.log("start red7index");
  Red7Spy.initialize();
  Red7Spy.start();
} catch (error) {
  console.error(error);
}

(window as any).conquerorSpy = Red7Spy;
