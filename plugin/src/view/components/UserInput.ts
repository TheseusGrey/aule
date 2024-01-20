

import { setIcon } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";


export default class UserInput implements RedomComponent {
	private readonly pluginSettings: AuleSettings;
	private readonly connection: WebSocket;

	private inputArea: HTMLTextAreaElement;
	private submitButton: HTMLElement;
	private onMessage: (newMessage: HistoryItem) => void;

	el = el('.aule-user-input');

	constructor(settings: AuleSettings, connection: WebSocket, onMessage: (newMessage: HistoryItem) => void) {
		this.pluginSettings = settings;
		this.connection = connection;
		this.onMessage = onMessage;

		this.inputArea = el('textarea');
		this.submitButton = el('button');

		setIcon(this.submitButton, 'messages-square')

		mount(this.el, this.inputArea);
		mount(this.el, this.submitButton);
	}

	setupEventListeners() {
		this.submitButton.onkeydown = e => {
			if (e.key !== 'Enter') return;
			e.preventDefault();

			const messageText = this.inputArea.value;
			this.onMessage({ prefix: '>', dialogue: messageText });
			this.connection.send(`lsn::${messageText}`);
			this.inputArea.value = "";
		};

		this.submitButton.onClickEvent(() => {
			const messageText = this.inputArea.value;
			this.onMessage({ prefix: '>', dialogue: messageText });
			this.connection.send(`lsn::${messageText}`);
			this.inputArea.value = "";
		})
	}

	update() { }
}
