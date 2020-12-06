import $ from "jquery";

export class Globals {
  static timerWrapperSelector =
    "#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnTimer";

  static getTurn() {
    const turnSelector: string =
      "#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount";
    return parseInt(
      $(turnSelector)
        .text()
        .substring(5)
    );
  }

  static getCountry(): string {
    const countrySelector =
      "#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0 > div > div.fieldHeaderWrapper > div.fieldHeader > span";
    let text = $(countrySelector)
      .text()
      .toLowerCase();

    function removeDiacritics(str: string) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    text = removeDiacritics(text);

    if (text === "ile de france") {
      text = "iledefrance";
    }

    return text;
  }

  static getMapDocumentExplicit(document: Document): Document {
    // TODO: prefetch it, but be carefull that after entring new game it has to be refreshed
    const map = document.getElementsByClassName("svgMap")[0] as HTMLObjectElement;
    return map.contentDocument as Document;
  }

  static getMapDocument(): Document {
    return Globals.getMapDocumentExplicit(document);
  }
}
