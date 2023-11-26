import { EditorView, WidgetType } from "@codemirror/view";
import { setIcon } from "obsidian";

export default class AuleWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const speechBubble = document.createElement('div');
    speechBubble.classList.add('aule-bubble');
    setIcon(speechBubble, 'messages-square');
    
    speechBubble.role = 'button';
    speechBubble.tabIndex = -1;
    return speechBubble;
	}
}