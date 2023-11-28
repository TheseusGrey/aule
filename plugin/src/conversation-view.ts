
import { AuleSettings } from './settings';
import {
	FileView,
	ItemView,
	MarkdownRenderer,
	MarkdownView,
	TextFileView,
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

		MarkdownRenderer.render(this.app, `\`\`\`dialogue
left: Aulë
right: Me

< Just a sample for the dialogue plugin we can build off
> We can use this to build the chat's between us and Aulë
\`\`\``, rootEl.createDiv(), 'Test', this)
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
