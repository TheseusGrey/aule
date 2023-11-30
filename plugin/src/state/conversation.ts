import { StateField, EditorState, Transaction, StateEffect } from '@codemirror/state'
import { assistantName } from "src/settings"

const assistantPrompt = `${assistantName}:`;

// Ways to interact with the StateField
export const aiResponseEffect = StateEffect.define<string>();
export const newPromptEffect = StateEffect.define<string>();
export const newConversationNameEffect = StateEffect.define<string>();

// New EditorState to keep track of user conversation
export const conversationField = StateField.define<Conversation>({
	create(state: EditorState): Conversation {
		return new Conversation();
	},

	update(oldState: Conversation, transaction: Transaction): Conversation {
		let newState = oldState;

		// We'll need effects for interacting with conversation state to go here
		for (let effect of transaction.effects) {
			if (effect.is(newPromptEffect)) {
				newState.history.push({ prefix: '>', dialogue: effect.value });
				continue;
			}
			if (effect.is(aiResponseEffect)) {
				newState.history.push({ prefix: '<', dialogue: effect.value.replace(assistantPrompt, '') });
				continue;
			}
			if (effect.is(newConversationNameEffect)) {
				newState.name = effect.value;
				continue;
			}
		}

		return newState;
	}
})


type HistoryItem = {
	prefix: string,
	dialogue: string,
}
export class Conversation {
	name: string
	history: HistoryItem[]

	constructor(name: string = "", history: HistoryItem[] = []) {
		this.name = name;
		this.history = history;
	}
}

