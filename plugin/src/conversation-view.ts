
import { AuleSettings } from './settings';
import {
  ItemView,
  WorkspaceLeaf,
} from 'obsidian';

export const AssistantViewType = 'aule-assistant-toolbar';

export class AssistantView extends ItemView {
  private readonly settings: AuleSettings;

  constructor(leaf: WorkspaceLeaf, settings: AuleSettings) {
    super(leaf);
    this.settings = settings;
  }

  public getViewType(): string {
    return AssistantViewType;
  }

  public getDisplayText(): string {
    return 'Aule';
  }

  public getIcon(): string {
    return 'messages-square';
  }

  public load(): void {
    super.load();
    this.draw();
  }

  private readonly draw = (): void => {
    const container = this.containerEl.children[1];

    const rootEl = document.createElement('div');
    rootEl.addClass("aule-conversation");

    rootEl.createDiv().
      createSpan({ cls: 'title' }).
      setText("Aule");


    container.empty();
    container.appendChild(rootEl);
  }
}

// /**
//  * Convert an svg string into an HTML element.
//  *
//  * @param svgText svg image as a string
//  */
// const Element = (svgText: string): HTMLElement => {
//   const parser = new DOMParser();
//   return parser.parseFromString(svgText, 'text/xml').documentElement;
// };