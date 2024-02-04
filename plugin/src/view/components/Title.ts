import { setIcon } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";

export default class Title implements RedomComponent {
	private readonly pluginSettings: AuleSettings;

	private title: HTMLElement;
	private clearButton: HTMLElement;

	el = el('.aule-title-bar');

	constructor(settings: AuleSettings, connection: WebSocket, conversation: HistoryItem[], title?: string) {
		this.pluginSettings = settings;
		this.title = el('h2');
		this.clearButton = el('button');

		this.title.textContent = title || this.pluginSettings.conversationName;

		setIcon(this.clearButton, 'mail-plus');

		mount(this.el, this.title);
		mount(this.el, this.clearButton);

		this.clearButton.onClickEvent(() => {
			connection.send("clr::");
			conversation.splice(0, conversation.length)
		})
	}


	update(newTitle: string) {
		this.title.textContent = newTitle;
	}
}
