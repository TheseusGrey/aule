
import {
	ItemView,
	MarkdownRenderer,
	setIcon,
	WorkspaceLeaf
} from 'obsidian';
import { el, mount } from 'redom';
import { parseMessage } from 'src/utils/helpers';
import { AuleSettings } from '../settings';
import Messages from './components/Messages';
import Title from './components/Title';
import UserInput from './components/UserInput';
import { ConversationState, HistoryItem } from './ConversationState';

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
	name: string;
	history: HistoryItem[];

	rootEl: HTMLElement;
	private title: Title;
	private conversation: Messages;
	private userInput: UserInput;

	constructor(leaf: WorkspaceLeaf, settings: AuleSettings, connection: WebSocket) {
		super(leaf);
		this.settings = settings;
		this.connection = connection;
		this.name = this.formateConversationName();
		this.history = initialConversation;

		this.rootEl = el('div.aule-conversation');
		this.draw();

		this.connection.onmessage = event => {
			const { command, content } = parseMessage(event.data)
			console.log(`Got a ${command} message from Aule saying: ${content}`)
			switch (command) {
				case 'lsn':
					this.appendToHistory({ prefix: '<', dialogue: content });
					break;
				default:
					break;
			}
		}
	}

	private readonly draw = (): void => {
		this.title = new Title(this.settings, this.name);
		this.conversation = new Messages(this.settings, this.history, this.appendToHistory);
		this.userInput = new UserInput(this.settings, this.connection, this.appendToHistory);

		mount(this.rootEl, this.title);
		mount(this.rootEl, this.conversation);
		mount(this.rootEl, this.userInput);
		this.containerEl.children[1].appendChild(this.rootEl);
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

	setConversationName(name: string) {
		this.name = name;
		this.title.update(name);
	}

	appendToHistory(newItem: HistoryItem) {
		this.history.push(newItem);
		// this.renderConversationHistory();
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
}

