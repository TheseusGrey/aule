
import { App, Component, MarkdownRenderer } from "obsidian";
import { el, mount, RedomComponent } from "redom";
import { AuleSettings } from "src/settings";
import { HistoryItem, MessageConfig } from "../ConversationState";
import { AssistantView } from "../ConversationView";

type MarkdownRenderConfig = {
	app: App,
	sourcePath: string,
	component: Component,
}

export default function messages(settings: AuleSettings, conversationHistory: HistoryItem[], view: AssistantView) {
	const markdownRenderConfig = {
		app: view.app,
		sourcePath: settings.conversationsFolder.concat(view.name),
		component: view,
	};

	const root = el('.aule-message-history');

	// This lets us intersperse the items with hr tags to give messages better separation
	const firstItem = conversationHistory.shift();
	if (firstItem) mount(root, new Message(firstItem, markdownRenderConfig))
	conversationHistory.map(item => new Message(item, markdownRenderConfig)).forEach(element => {
		mount(root, el('hr'))
		mount(root, element)
	});

	return root;
}

class Message implements RedomComponent {
	private readonly messageHeader: HTMLElement;

	el = el('.aule-message');

	constructor(message: HistoryItem, markdownRenderConfig: MarkdownRenderConfig) {
		this.el.dataset.participant = message.metadata.participant;

		this.messageHeader = el('h4');
		this.messageHeader.textContent = message.metadata.author;
		mount(this.el, this.messageHeader);

		MarkdownRenderer.render(
			markdownRenderConfig.app,
			message.dialogue,
			this.el,
			markdownRenderConfig.sourcePath,
			markdownRenderConfig.component
		);
	}
}
