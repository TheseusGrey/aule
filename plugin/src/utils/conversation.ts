import { assistantName } from "src/settings"

export class Conversation {
	name: string
	history: string[]


}





const re = new RegExp(`${assistantName}`)

export function formatResponse(response: string) {
	return response.replace(re, "<");
}
