
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
	container = this.containerEl.children[1];
	rootEl = document.createElement('div');
	title = this.rootEl.createEl('h1', { cls: 'title' });
	conversationEl = this.rootEl.createDiv({ cls: 'aule-conversation-wrapper' });
	inputContainer = this.rootEl.createDiv({ cls: 'aule-input-container' });

	constructor(leaf: WorkspaceLeaf, settings: AuleSettings) {
		super(leaf);
		this.settings = settings;
		this.name = this.formateConversationName();
		this.history = this.initaliseConversation();
		console.log(this.formateConversationName());
		this.title.setText(this.name);
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
		let conversationName = this.settings.conversationName;
		if (this.settings.includeTimestamp) {
			const timestamp = new Intl.DateTimeFormat(navigator.language, {
				timeStyle: 'short',
				dateStyle: 'medium'
			}).format(Date.now())
			conversationName += ` [${timestamp}]`
		}
		return conversationName;
	}

	private initaliseConversation = () => {
		return [
			{ prefix: '', dialogue: '```dialogue' },
			{ prefix: 'left:', dialogue: 'Aulë' },
			{ prefix: 'right:', dialogue: 'Me' },
			{ prefix: '', dialogue: '' },
			{ prefix: '#', dialogue: 'Send a message to get this conversation rolling!' }
		] as HistoryItem[]
	}

	private readonly draw = (): void => {
		this.rootEl.addClass("aule-conversation");

		this.renderUserInput();
		this.renderConversationHistory();
		this.container.appendChild(this.rootEl);
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

	private renderUserInput() {
		const inputEl = this.inputContainer.createEl("textarea", { cls: 'aule-input-area' });
		const inputButtonEl = this.inputContainer.createEl("button", { cls: 'aule-input-button' });
		setIcon(inputButtonEl, this.getIcon());

		inputButtonEl.onClickEvent(() => {
			this.history.push({ prefix: '>', dialogue: inputEl.value });
			this.renderConversationHistory();
			this.app.workspace.requestSaveLayout();
			inputEl.value = "";
		})
	}
	private renderConversationHistory() {
		const previousRenders = document.getElementsByClassName("block-language-dialogue");
		while (previousRenders.length > 0) {
			previousRenders[0].parentNode?.removeChild(previousRenders[0]);
		}

		const convoHistory = this.history
			.map(item => `${item.prefix} ${item.dialogue}`)
			.join('\n')
			.concat('\n```');

		MarkdownRenderer.render(
			this.app,
			convoHistory,
			this.conversationEl,
			this.settings.conversationsFolder.concat(this.name),
			this
		);

		this.conversationEl.scrollTop = this.conversationEl.scrollHeight - this.conversationEl.clientHeight;
	}
}

