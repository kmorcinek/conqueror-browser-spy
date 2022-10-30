import { Card } from "./Card";
import { Color } from "./Color";
import { MoveToPalette } from "./MoveToPalette";

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

  getMyPalette(): Card[] {
    const allPaletteRows = document.getElementById("all_rows")!;
    const whiteBlock = allPaletteRows.firstElementChild!;
    const palette = whiteBlock.children[1];

    const cardElements = palette.children;
    console.log(cardElements);
    const listArray = Array.from(cardElements);
    const elements = [] as Card[];
    listArray.forEach(item => {
      const card = Card.parseCard(item);
      elements.push(card);
    });
    console.log("MyPalette", elements);
    return elements;
  }

  getOponentPalette(): Card[] {
    const allPaletteRows = document.getElementById("all_rows")!;
    const whiteBlock = allPaletteRows.children[1];
    const palette = whiteBlock.children[1];

    const cardElements = palette.children;
    const listArray = Array.from(cardElements);
    const elements = [] as Card[];
    listArray.forEach(item => {
      const card = Card.parseCard(item);
      elements.push(card);
    });
    console.log("OponentPalette", elements);
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

  moveToPalette(move: MoveToPalette) {
    const card = move.card;
    console.log(`Moving (clicking) card ${card.toString()} to palette`);
    this.clickCard(card.elementId);
    this.clickPalette();

    window.setTimeout(() => {
      this.clickFinishMove();
    }, 1000);
  }

  private clickPalette() {
    const allPaletteRows = document.getElementById("all_rows")!;
    const palette = allPaletteRows.firstElementChild!;
    (palette as any).click();
  }

  private clickFinishMove() {
    const button = document.getElementById("button_3_id")!;
    (button as any).click();
  }
}
