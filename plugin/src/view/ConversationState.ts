
export type MessageConfig = {
	author: string,
	participant: 'user' | 'model',
}

export type HistoryItem = {
	metadata: MessageConfig,
	dialogue: string,
}

export interface ConversationState {
	name: string
	history: HistoryItem[]
}
