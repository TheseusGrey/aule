
import { App, Component, ItemView, MarkdownRenderer } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";
import { AssistantView } from "../ConversationView";

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
	private readonly markdownRenderConfig: MarkdownRenderConfig;
	private readonly messageHistory: HTMLElement[];

	el = el('.aule-message-history');

	constructor(
		settings: AuleSettings,
		initialConversation: HistoryItem[],
		viewInfo: AssistantView
	) {
		this.pluginSettings = settings;
		this.markdownRenderConfig = {
			app: viewInfo.app,
			sourcePath: this.pluginSettings.conversationsFolder.concat(viewInfo.name),
			component: viewInfo,
		};

		// Here we map the inital list (I.e. if we're loading from a file or something)
		// to our message elements
	}

	update(newMessage: HistoryItem) {
		// This will be called on getting a new message
		// We create just render and append, rather than
		// re-render the entire list.
	}
}

type MessageConfig = {
	author?: string,
	participant?: 'user' | 'model',
	showAuthor?: boolean,
}

type MarkdownRenderConfig = {
	app: App,
	sourcePath: string,
	component: Component,
}

class Message implements RedomComponent {
	private readonly messageHeader: HTMLElement;

	el = el('.aule-message');

	constructor(messageContent: string, markdownRenderConfig: MarkdownRenderConfig, messageConfig?: MessageConfig) {
		this.el.dataset.participant = messageConfig?.participant || 'user';

		if (messageConfig?.author && messageConfig.showAuthor) {
			this.messageHeader = el('h4');
			this.messageHeader.textContent = messageConfig.author;
			mount(this.el, this.messageHeader);
		}

		MarkdownRenderer.render(
			markdownRenderConfig.app,
			messageContent,
			this.el,
			markdownRenderConfig.sourcePath,
			markdownRenderConfig.component
		);
	}
}
