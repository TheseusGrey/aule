import { StateField, EditorState, Transaction, StateEffect } from '@codemirror/state'
import { assistantName } from "src/settings"


const re = new RegExp(`${assistantName}`)

// Ways to interact with the StateField
export const aiResponseEffect = StateEffect.define<string>();
export const newPromptEffect = StateEffect.define<string>();
export const newConversationNameEffect = StateEffect.define<string>();
export const saveConversationEffect = StateEffect.define();

// New EditorState to keep track of user conversation
export const conversationField = StateField.define<Conversation>({
	create(state: EditorState): Conversation {
		return new Conversation();
	},

	update(oldState: Conversation, transaction: Transaction): Conversation {
		let newState = oldState;

		// We'll need effects for interacting with conversation state to go here
		for (let effects of transaction.effects) { }

		return newState;
	}
})



export class Conversation {
	name: string
	history: string[]

	constructor(name: string = "", history: [] = []) {
		this.name = name;
		this.history = history;
	}
}

