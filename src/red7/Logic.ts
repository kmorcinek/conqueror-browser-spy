
export class Logic {

  getMyHand(): string[] {
    const myCards = document.getElementById("my_cards")!;

    let cardElements = myCards.children;
    const listArray = Array.from(cardElements);
    const elements = [] as string[];
    listArray.forEach((item) => { elements.push(item.id) });
    return elements;
  }

  clickCanvas() {
    let canvas = document.getElementById("Uncanvas")!;
    canvas.click();
  }

// var cardElement = document.getElementById("my_cards_item_16");
// cardElement.click()
  clickPallete() {
    const allPalleteRows = document.getElementById("all_rows")!;
    const pallete = allPalleteRows.firstElementChild!;
    pallete.click();
  }
}
