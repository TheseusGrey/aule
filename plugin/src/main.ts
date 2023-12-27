import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { AuleSettings, DEFAULT_SETTINGS, assistantName } from "./settings";
import { AssistantView, AssistantViewType } from "./view/ConversationView";
import commands from "./commands";
import { conversationField } from "./state/conversation";
import { getAssistantView } from "./utils/helpers";


export default class Aule extends Plugin {
	public settings: AuleSettings;
	public modelHost: WebSocket;


	async onload() {
		await this.loadSettings();
		this.registerEditorExtension([conversationField])

		this.registerView(
			AssistantViewType,
			(leaf) => new AssistantView(leaf, this.settings, this.modelHost),
		);

		this.modelHost = new WebSocket(this.settings.modelHostUrl);
		this.modelHost.onmessage = event => {
			const view = getAssistantView(this);
			console.log(view);
			console.log(event.data);
			view?.appendAssistantDialogue(event.data);
		}

		this.addRibbonIcon(
			"messages-square",
			assistantName,
			() => {
				this.toggleAssistantView();
			}
		);


		commands(this).forEach(command => this.addCommand(command))

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });


		console.log("Aule: Connection to Language Model established.")
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	readonly toggleAssistantView = async (): Promise<void> => {
		const existing = this.app.workspace.getLeavesOfType(AssistantViewType);
		if (existing.length) {
			this.app.workspace.revealLeaf(existing[0]);
			return;
		}

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: AssistantViewType,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(AssistantViewType)[0],
		);
	};
}

class SampleSettingTab extends PluginSettingTab {
	plugin: Aule;

	constructor(app: App, plugin: Aule) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Model Host Location")
			.setDesc("URL hosting the model, can be local or on the web somewhere, should be in the format: ws://{url}:{port}.")
			.addText((newHostLocation) =>
				newHostLocation
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.modelHostUrl)
					.onChange(async (value) => {
						this.plugin.settings.modelHostUrl = value;
						this.plugin.modelHost = new WebSocket(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
