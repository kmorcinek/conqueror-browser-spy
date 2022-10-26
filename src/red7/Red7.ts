export class Red7 {

  getMyHand(): string[] {
    const myCards = document.getElementById("my_cards")!;

    const cardElements = myCards.children;
    const listArray = Array.from(cardElements);
    const elements = [] as string[];
    listArray.forEach((item) => { elements.push(item.id) });
    return elements;
  }

  clickCanvas() {
    const canvas = document.getElementById("Uncanvas")!;
    canvas.click();
  }

  clickCard(cardId: string) {
    const cardElement  = document.getElementById(cardId);

    if(cardElement === null) {
      alert(`card with id ${cardId} not found`);
    } else {
      cardElement.click();
    }
  }

  clickPallete() {
    const allPalleteRows = document.getElementById("all_rows")!;
    const pallete = allPalleteRows.firstElementChild!;
    (pallete as any).click();
  }
}
