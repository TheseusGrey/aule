
import { setIcon } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";

//private renderConversationHistory() {
//		this.conversationEl.empty();
//
//		const convoHistory = this.history
//			.map(item => `${item.prefix} ${item.dialogue}`)
//			.join('\n')
//			.concat('\n```');
//
//		MarkdownRenderer.render(
//			this.app,
//			convoHistory,
//			this.conversationEl,
//			this.settings.conversationsFolder.concat(this.name),
//			this
//		);
//
//		// This makes the scroll hit the bottom on every re-render
//		this.conversationEl.scrollTop = this.conversationEl.scrollHeight - this.conversationEl.clientHeight;
//	}

export default class Messages implements RedomComponent {
	private readonly pluginSettings: AuleSettings;


	el = el('.aule-message-history');

	constructor(settings: AuleSettings) {
		this.pluginSettings = settings;
	}

	setupEventListeners() {
	}

	update() {
	}
}
