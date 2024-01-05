from websockets import WebSocketServerProtocol
from dataclasses import dataclass
from typing import Any
from utils.conversationHelpers import Conversation, formatPrompt
from handlers import listenHandler

@dataclass
class Context: 
	connection: WebSocketServerProtocol
	conversation: Conversation


async def processMessage(messageType: str, content: str, context: Context, deviceType: str, model: Any, tokenizer: Any):
    print('Incoming {} message from {}'.format(messageType, context.connection.id))
    match messageType:
        case 'lsn':
			# Leaving convo context out for now as the new model might do something different
            fullConversation = formatPrompt(context.conversation.history, 'You: ' + content)
            response = listenHandler(fullConversation, model, tokenizer, deviceType)
            await context.connection.send('lsn::{}'.format(response))
        case 'ctx':
            context.conversation.previousContext = context.conversation.context
            context.conversation.context = content
            context.conversation.contextUpdated = True
        case _:
            print("Unknown command, skipping...")

