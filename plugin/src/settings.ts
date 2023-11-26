export const assistantName = "Aulë"

export interface AuleSettings {
	modelHostUrl: string;
}

export const DEFAULT_SETTINGS: AuleSettings = {
	modelHostUrl: "ws://localhost:8765"
};