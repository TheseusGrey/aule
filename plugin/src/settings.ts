export const assistantName = "Aulë"

export interface AuleSettings {
	modelHostUrl: string;
	conversationsFolder: string;
	allowAutoConversation: boolean;
	conversationName: string;
	includeTimestamp: boolean;
}

export const DEFAULT_SETTINGS: AuleSettings = {
	modelHostUrl: "ws://localhost:8765",
	conversationsFolder: 'conversations',
	allowAutoConversation: false,
	conversationName: 'Conversation',
	includeTimestamp: true,
}
