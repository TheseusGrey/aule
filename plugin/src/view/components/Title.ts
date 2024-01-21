import { setIcon } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";

export default class Title implements RedomComponent {
	private readonly pluginSettings: AuleSettings;

	private title: HTMLElement;
	private clearButton: HTMLElement;

	el = el('.aule-title-bar');

	constructor(settings: AuleSettings, title?: string) {
		this.pluginSettings = settings;
		this.title = el('h2');
		this.clearButton = el('button');

		this.title.textContent = title || this.pluginSettings.conversationName;

		setIcon(this.clearButton, 'mail-plus');

		mount(this.el, this.title);
		mount(this.el, this.clearButton);
	}

	update(newTitle: string) {
		this.title.textContent = newTitle;
	}
}
