export class GameLobbyClicker {
  clickMultiplayer() {
    console.log("Clicking multiplayer");
    const multiplayerSelector = "#lobbyWrapper > div > div > div.topContainer > div.area.areaTL > div > div.viewContent > div:nth-child(2)"
    const button = $(multiplayerSelector);
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

  clickQuitGame() {
    console.log("Clicking quit game");
    const button = this.getElementByClassName("gameToolsQuit");
    this.click(button);
  }

  confirmQuit() {
    console.log("Confirming quit game");
    var elements =  document.getElementsByClassName("dpWidgetDialogSubmit");
    console.log("elements: ", elements.length);
    for (const element of elements) {
      this.mouseDown(element);
    }
  }

  private click(element: any | null) {
    if (element !== null) {
      this.mouseDown(element);
    }
  }

  private mouseDown(element: any) {
    element.dispatchEvent(new Event("mousedown"));
  }

  private getElementByClassName(className: string) {
    return document.getElementsByClassName(className)[0];
  }
}
