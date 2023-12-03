import { AssistantView, AssistantViewType } from "../view/ConversationView";
import Aule from "src/main";


export const getAssistantView: (plugin: Aule) => AssistantView | undefined = (plugin: Aule) => {
	return this.app.workspace.getLeavesOfType(AssistantViewType).reduce((acc, currentVal) => {
		if (currentVal instanceof AssistantView) return currentVal
	}, undefined);
}
