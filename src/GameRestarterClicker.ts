import $ from "jquery";

export class GameRestarterClicker {
  clickMultiplayer() {
    console.log("Clicking multiplayer");
    const multiplayerSelector =
      "#lobbyWrapper > div > div > div.topContainer > div.area.areaTL > div > div.viewContent > div:nth-child(2)";
    const buttons = $(multiplayerSelector);
    const button = buttons[0];
    this.click(button);
  }

  clickCreateGame() {
    console.log("Clicking create game");
    const button = this.getElementByClassName("start button");
    this.click(button);
  }

  clickStartGame() {
    console.log("Clicking start game");
    const button = this.getElementByClassName("readyButton button");
    this.click(button);
  }

  clickExitGame() {
    console.log("Clicking exit game");
    const button = this.getElementByClassName("gameToolsQuit");
    this.click(button);
  }

  confirmExit() {
    console.log("Confirming exit game");
    const elements = document.getElementsByClassName("dpWidgetDialogSubmit");
    console.log("elements: ", elements.length);
    for (const element of elements) {
      this.mouseDown(element);
    }
  }

  private click(element: Element | null) {
    if (element !== null) {
      this.mouseDown(element);
    }
  }

  private mouseDown(element: Element) {
    element.dispatchEvent(new Event("mousedown"));
  }

  private getElementByClassName(className: string) {
    return document.getElementsByClassName(className)[0];
  }
}
