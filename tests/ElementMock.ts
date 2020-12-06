import { IHtmlDocument } from "../src/IHtmlDocument";

export class ElementMock {
  contentDocument!: IHtmlDocument | null;
  id!: string | null;
  textContent!: string | null;

  toElement(): Element {
    return (this as unknown) as Element;
  }
}
