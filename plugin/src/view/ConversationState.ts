

export type HistoryItem = {
	prefix: string,
	dialogue: string,
}

export interface ConversationState {
	name: string
	history: HistoryItem[]
}
