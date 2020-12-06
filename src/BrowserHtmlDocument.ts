import { IHtmlDocument } from "./IHtmlDocument";

export class BrowserHtmlDocument implements IHtmlDocument {
  getElementsByClassName(classNames: string): Element[] {
    return (document.getElementsByClassName(classNames) as unknown) as Element[];
  }
}
