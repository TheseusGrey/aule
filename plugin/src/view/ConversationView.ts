
import {
	ItemView,
	WorkspaceLeaf
} from 'obsidian';
import { el, mount } from 'redom';
import { parseMessage } from 'src/utils/helpers';
import { assistantName, AuleSettings } from '../settings';
import messages from './components/Messages';
import Title from './components/Title';
import userInput from './components/UserInput';
import { ConversationState, HistoryItem } from './ConversationState';

export const AssistantViewType = 'aule-assistant-toolbar';

const initialConversation: HistoryItem[] = [
	{
		dialogue: 'Send a message to get this conversation rolling! :D', metadata: {
			author: assistantName,
			participant: 'model',
		}
	}
]


export class AssistantView extends ItemView implements ConversationState {
	private readonly settings: AuleSettings;
	private readonly connection: WebSocket;
	name: string;
	history: HistoryItem[];

	rootEl: HTMLElement;
	private title: Title;
	private conversation: HTMLElement;
	private userInput: HTMLElement;

	constructor(leaf: WorkspaceLeaf, settings: AuleSettings, connection: WebSocket) {
		super(leaf);
		this.settings = settings;
		this.connection = connection;
		this.name = this.formateConversationName();
		this.history = initialConversation;

		this.rootEl = el('div.aule-conversation');

		this.connection.onmessage = event => {
			const { command, content } = parseMessage(event.data)
			console.log(`Got a ${command} message from Aule saying: ${content}`)
			switch (command) {
				case 'lsn':
					this.appendToHistory({
						dialogue: content, metadata: {
							author: assistantName,
							participant: 'model'
						}
					});
					break;
				default:
					break;
			}
		}
	}

	private readonly draw = (): void => {
		this.title = new Title(this.settings, this.connection, this.history, this.name);
		this.conversation = messages(this.settings, this.history, this);
		this.userInput = userInput(this.settings, this.connection, this.appendToHistory.bind(this));

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
		console.log(this);
		console.log(this.history);
		this.history.push(newItem);
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

