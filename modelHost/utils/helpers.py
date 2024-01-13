from websockets import WebSocketServerProtocol
from dataclasses import dataclass
from typing import Any
from utils.conversationHelpers import provideContextToModel
from transformers import Conversation
from handlers import listenHandler
from time import time
import re


@dataclass
class Context: 
	connection: WebSocketServerProtocol
	conversation: Conversation
	contextInformation: str
	contextInfoChanged: bool = False

async def processMessage(messageType: str, content: str, context: Context, pipeline: Any, tokenizer: Any):
	print('Incoming {} message from {}'.format(messageType, context.connection.id))
	match messageType:
		case 'lsn':
			startTime = time()
			context.conversation.add_message({"role": "user", "content": content})
			conversation = listenHandler(context.conversation, tokenizer, pipeline)
			response = conversation[0]["generated_text"].split("<|model|>")[-1]
			context.conversation.add_message({"role": "assistant", "content": response})
			await context.connection.send('lsn::{}'.format(response))
			endTime = time()
			print(f"Generated response in {endTime - startTime}s")
		case 'ctx':
			context.conversation.add_message(provideContextToModel(content))
		case _:
			print("Unknown command, skipping...")

