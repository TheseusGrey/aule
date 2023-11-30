
import { AuleSettings } from './settings';
import {
	ItemView,
	MarkdownRenderer,
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

	private formateConversationName = () => {
		// We can pull ways to configure this from the settings
		const timestamp = new Intl.DateTimeFormat(navigator.language, {
			timeStyle: 'medium',
			dateStyle: 'medium'
		}).format(Date.now())

		return `New Conversation [${timestamp}]`
	}


	private readonly draw = (): void => {
		const container = this.containerEl.children[1];
		const rootEl = document.createElement('div');
		rootEl.createEl('h1', { cls: 'title' }).
			setText(this.formateConversationName())
		rootEl.addClass("aule-conversation");
		const conversationEl = rootEl.createDiv();

		MarkdownRenderer.render(this.app, `\`\`\`dialogue
left: Aulë
right: Me

< Just a sample for the dialogue plugin we can build off
> We can use this to build the chat's between us and Aulë
\`\`\``, conversationEl, 'Test', this)
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
