
import { setIcon } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";

export default class Messages implements RedomComponent {
	private readonly pluginSettings: AuleSettings;

	private title: HTMLElement;
	private clearButton: HTMLElement;

	el = el('.aule-title-bar');

	constructor(settings: AuleSettings, history: HistoryItem[] = [], onMessage: (newMessage: HistoryItem) => void) {
		this.pluginSettings = settings;
		this.title = el('h2');
		this.clearButton = el('button');


		setIcon(this.clearButton, 'clear button icon of some kind');

		mount(this.el, this.title);
		mount(this.el, this.clearButton);
	}

	setupEventListeners() {
	}

	update(newTitle: string) {
		this.title.textContent = newTitle;
	}
}
