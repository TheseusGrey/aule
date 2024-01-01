
import { AuleSettings } from '../settings';
import {
	ItemView,
	MarkdownRenderer,
	setIcon,
	ViewStateResult,
	WorkspaceLeaf,
} from 'obsidian';
import { ConversationState, HistoryItem } from './ConversationState';
import { formatMessage } from 'src/utils/helpers';

export const AssistantViewType = 'aule-assistant-toolbar';

const initialConversation = [
	{ prefix: '', dialogue: '```dialogue' },
	{ prefix: 'left:', dialogue: 'Aulë' },
	{ prefix: 'right:', dialogue: 'Me' },
	{ prefix: '', dialogue: '' },
	{ prefix: '#', dialogue: 'Send a message to get this conversation rolling!' }
]

export class AssistantView extends ItemView implements ConversationState {
	private readonly settings: AuleSettings;
	private readonly connection: WebSocket;
	name: string
	history: HistoryItem[]
	lastMessage: number
	container = this.containerEl.children[1];
	rootEl = document.createElement('div');
	title = this.rootEl.createEl('h1', { cls: 'title' });
	conversationEl = this.rootEl.createDiv({ cls: 'aule-conversation-wrapper' });
	inputContainer = this.rootEl.createDiv({ cls: 'aule-input-container' });

	constructor(leaf: WorkspaceLeaf, settings: AuleSettings, connection: WebSocket) {
		super(leaf);
		this.settings = settings;
		this.connection = connection
		this.name = this.formateConversationName();
		this.history = initialConversation;
		this.lastMessage = Date.now();
		this.rootEl.addClass("aule-conversation");
		this.title.setText(this.name);

		this.connection.onmessage = event => {
			this.appendAssistantDialogue(event.data);
		}


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
			lastMessage: this.lastMessage
		};
	}

	public load(): void {
		super.load();
		if (((Date.now() - this.lastMessage) / 36e5) > 36e5) {
			this.history = initialConversation
			this.app.workspace.requestSaveLayout();
		}

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

	private readonly draw = (): void => {
		this.renderUserInput();
		this.renderConversationHistory();
		this.container.appendChild(this.rootEl);
	}

	setConversationName(name: string) {
		this.name = name;
		this.title.setText(this.name);
		this.app.workspace.requestSaveLayout();
	}

	appendToHistory(newItem: HistoryItem) {
		this.history.push(newItem);
		this.app.workspace.requestSaveLayout();
		this.renderConversationHistory();
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
			this.appendUserDialogue(inputEl.value);
			this.lastMessage = Date.now();
			this.app.workspace.requestSaveLayout();
			this.connection.send(`lsn::${formatMessage(inputEl.value, true)}`);
			inputEl.value = "";
		})
	}

	private renderConversationHistory() {
		this.conversationEl.empty();

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

		// This makes the scroll hit the bottom on every re-render
		this.conversationEl.scrollTop = this.conversationEl.scrollHeight - this.conversationEl.clientHeight;
	}
}

