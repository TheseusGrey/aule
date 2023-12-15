
import { AuleSettings } from '../settings';
import {
	ItemView,
	MarkdownRenderer,
	setIcon,
	ViewStateResult,
	WorkspaceLeaf,
} from 'obsidian';
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
		const conversationName = this.settings.conversationName;
		if (this.settings.includeTimestamp) {
			const timestamp = new Intl.DateTimeFormat(navigator.language, {
				timeStyle: 'medium',
				dateStyle: 'medium'
			}).format(Date.now())
			conversationName + ` [${timestamp}]`
		}

		return conversationName;
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
		const inputContainer = rootEl.createDiv({ cls: 'aule-input-container' });

		const inputEl = inputContainer.createEl("textarea", { cls: 'aule-input-area' });
		const inputButtonEl = inputContainer.createEl("button", { cls: 'aule-input-button' });
		setIcon(inputButtonEl, this.getIcon());
		MarkdownRenderer.render(
			this.app,
			this.history.map(item => `${item.prefix} ${item.dialogue}`).join('\n').concat('\n```'),
			conversationEl,
			'Test',
			this)

		container.appendChild(rootEl);
	}

	setConversationName(name: string) {
		this.name = name;
		this.app.workspace.requestSaveLayout();
	}

	appendToHistory(newItem: HistoryItem) {
		this.history.push(newItem);
		this.app.workspace.requestSaveLayout();
	}

	appendUserDialogue(dialogue: string) {
		this.appendToHistory({ prefix: '>', dialogue: dialogue });
	}

	appendAssistantDialogue(dialogue: string) {
		this.appendToHistory({ prefix: '<', dialogue: dialogue });
	}

}

