

import { setIcon } from "obsidian";
import { el, mount } from "redom";
import { assistantName, AuleSettings } from "src/settings";
import { HistoryItem } from "../ConversationState";

type MessageHandler = (newMessage: HistoryItem) => void
export default function userInput(settings: AuleSettings, connection: WebSocket, onMessage: MessageHandler) {
	const root = el('.aule-user-input');
	const inputArea = el('textarea');
	const submitButton = el('button');


	submitButton.onkeydown = e => {
		if (e.key !== 'Enter') return;
		e.preventDefault();

		const messageText = inputArea.value;
		onMessage({
			dialogue: messageText, metadata: {
				author: 'Me',
				participant: 'user',
			}
		});
		connection.send(`lsn::${messageText}`);
		inputArea.value = "";
	};

	submitButton.onClickEvent(() => {
		const messageText = inputArea.value;
		onMessage({
			dialogue: messageText, metadata: {
				author: assistantName,
				participant: 'model',
			}
		});
		connection.send(`lsn::${messageText}`);
		inputArea.value = "";
	})

	setIcon(submitButton, 'messages-square')
	mount(root, inputArea);
	mount(root, submitButton);

	return root;
}

