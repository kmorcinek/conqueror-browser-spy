import { Card } from "./Card";
import { Color } from "./Color";
import { MoveToPallete } from "./MoveToPalette";

export class Red7 {
  getMyHand(): Card[] {
    const myCards = document.getElementById("my_cards")!;

    const cardElements = myCards.children;
    const listArray = Array.from(cardElements);
    const elements = [] as Card[];
    listArray.forEach(item => {
      const card = Card.parseCard(item);
      elements.push(card);
    });
    return elements;
  }

  getMyPallete(): Card[] {
    const allPalleteRows = document.getElementById("all_rows")!;
    const whiteBlock = allPalleteRows.firstElementChild!;
    const pallete = whiteBlock.children[1];

    const cardElements = pallete.children;
    console.log(cardElements);
    const listArray = Array.from(cardElements);
    const elements = [] as Card[];
    listArray.forEach(item => {
      const card = Card.parseCard(item);
      elements.push(card);
    });
    console.log("MyPallete", elements);
    return elements;
  }

  getOponentPallete(): Card[] {
    const allPalleteRows = document.getElementById("all_rows")!;
    const whiteBlock = allPalleteRows.children[1];
    const pallete = whiteBlock.children[1];

    const cardElements = pallete.children;
    const listArray = Array.from(cardElements);
    const elements = [] as Card[];
    listArray.forEach(item => {
      const card = Card.parseCard(item);
      elements.push(card);
    });
    console.log("OponentPallete", elements);
    return elements;
  }

  getCurrentRule(): Color {
    return Color.Red;
  }

  clickCanvas() {
    const canvas = document.getElementById("Uncanvas")!;
    canvas.click();
  }

  private clickCard(cardId: string) {
    const cardElement = document.getElementById(cardId);

    if (cardElement === null) {
      alert(`card with id ${cardId} not found`);
    } else {
      cardElement.click();
    }
  }

  moveToPallete(move: MoveToPallete) {
    const card = move.card;
    console.log(`Moving (clicking) card ${card.toString()} to pallete`);
    this.clickCard(card.elementId);
    this.clickPallete();
  }

  private clickPallete() {
    const allPalleteRows = document.getElementById("all_rows")!;
    const pallete = allPalleteRows.firstElementChild!;
    (pallete as any).click();
  }
}
