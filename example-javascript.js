
function getMyHand() {
    var myCards = document.getElementById("my_cards");

    let cardElements = myCards.children;
    const listArray = Array.from(cardElements);
    const elements = [];
    listArray.forEach((item) => {elements.push(item.id)});
    return elements;
}

function clickCanvas() {
    let canvas = document.getElementById("Uncanvas");
    canvas.click();
}

var cardElement = document.getElementById("my_cards_item_16");
cardElement.click()



function clickPallete() {
    let allPalleteRows = document.getElementById("all_rows");
    let pallete = allPalleteRows.firstElementChild;
    pallete.click();
}