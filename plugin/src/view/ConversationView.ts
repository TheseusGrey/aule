
import { AuleSettings } from './settings';
import {
	ItemView,
	MarkdownRenderer,
	ViewStateResult,
	WorkspaceLeaf,
} from 'obsidian';
import { Conversation } from './utils/conversation';
import { ConversationState, HistoryItem } from './ConversationState';

export const AssistantViewType = 'aule-assistant-toolbar';

export class AssistantView extends ItemView implements ConversationState {
	private readonly settings: AuleSettings;
	name: string
	history: HistoryItem[]


	constructor(leaf: WorkspaceLeaf, settings: AuleSettings) {
		super(leaf);
		this.settings = settings;
		this.name = this.formateConversationName();
		this.history = this.initaliseConversation();
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

	async setState(state: ConversationState, result: ViewStateResult): Promise<void> {
		if (state.name) this.name = state.name;
		if (state.history) this.history = state.history;

		return super.setState(state, result);
	}

	getState(): ConversationState {
		return {
			name: this.name,
			history: this.history,
		};
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

		return `Conversation [${timestamp}]`
	}

	private initaliseConversation = () => {
		return [
			{ prefix: '', dialogue: '```dialogue' },
			{ prefix: 'left:', dialogue: 'Aulë' },
			{ prefix: 'right:', dialogue: 'Me' },
			{ prefix: '', dialogue: '' },
		] as HistoryItem[]
	}
	private readonly draw = (): void => {
		const container = this.containerEl.children[1];
		const rootEl = document.createElement('div');
		rootEl.createEl('h1', { cls: 'title' }).
			setText(this.name)
		rootEl.addClass("aule-conversation");
		const conversationEl = rootEl.createDiv();

		MarkdownRenderer.render(
			this.app,
			this.history.map(item => `${item.prefix} ${item.dialogue}`).join('\n'),
			conversationEl,
			'Test',
			this)
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
