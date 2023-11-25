import {
	App,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { auleBubblePlugin } from "./speechBubble/view";

interface AuleSettings {
	modelHostUrl: string;
}

const DEFAULT_SETTINGS: AuleSettings = {
	modelHostUrl: "ws://localhost:8765"
};

export default class Aule extends Plugin {
	settings: AuleSettings;
	modelHost: WebSocket;
	
	async onload() {
		await this.loadSettings();
		this.registerEditorExtension([auleBubblePlugin])
		this.modelHost = new WebSocket(this.settings.modelHostUrl);
		this.modelHost.onmessage = event => {
			console.log(event.data)
		}
		
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		this.addCommand({
			id: "test-aule",
			name: "Prompt Aule",
			callback: () => {
				new ExampleModal(this.app, result => {
					this.modelHost.send(`lsn:: ${result}`)
				}).open()
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
		console.log("Aule: Connection to Language Model established.")
	}


	
	onunload() {}

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
}

export class ExampleModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Test Prompt:" });

    new Setting(contentEl)
      .setName("Prompt:")
      .addText((text) =>
        text.onChange((value) => {
          this.result = value
        }));

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
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
