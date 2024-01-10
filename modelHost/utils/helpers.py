from websockets import WebSocketServerProtocol
from dataclasses import dataclass
from typing import Any
from utils.conversationHelpers import provideContextToModel
from transformers import Conversation
from handlers import listenHandler
from time import time

@dataclass
class Context: 
	connection: WebSocketServerProtocol
	conversation: Conversation


async def processMessage(messageType: str, content: str, context: Context, pipeline: Any, tokenizer: Any):
	print('Incoming {} message from {}'.format(messageType, context.connection.id))
	match messageType:
		case 'lsn':
			startTime = time()
			context.conversation.add_message({"role": "user", "content": content})
			conversation = listenHandler(context.conversation, tokenizer, pipeline)
			print(conversation)
			response = conversation[-1]["content"]
			await context.connection.send('lsn::{}'.format(response))
			endTime = time()
			print(f"Generated response in {endTime - startTime}s")
		case 'ctx':
			context.conversation.add_message(provideContextToModel(content))
		case _:
			print("Unknown command, skipping...")

