import asyncio
from typing import Dict
from uuid import UUID

import torch
from utils.helpers import Context, processMessage
import websockets
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, Conversation
from utils.conversationHelpers import initialiseConversation

# App config
modelName = "PygmalionAI/pygmalion-2-7b"

# Model Initialisation
tokenizer = AutoTokenizer.from_pretrained(modelName)
pipeline = pipeline(
    "text-generation",
    model=modelName,
    torch_dtype=torch.float16,
	device="cuda",
)

# Websocket Connections
connections: Dict[UUID, Context]  = {}

# Message Handler
async def handler(websocket: websockets.WebSocketServerProtocol):
	if websocket.id not in connections:
		newConversation = Conversation([initialiseConversation()], websocket.id)
		connections[websocket.id] = Context(websocket, newConversation, "")
		print(connections)
	while True:
		try:
			message = await websocket.recv()
			assert isinstance(message, str)

			[eventType, messageContent] = message.split("::", 1)
			await processMessage(
				eventType,
				messageContent,
				connections[websocket.id],
				pipeline,
				tokenizer
			)

		except websockets.ConnectionClosedOK:
			connections.pop(websocket.id)
		except AssertionError:
			print("Unable to parse incoming message.")

async def main():
	async with websockets.serve(handler, "localhost", 8765):
		await asyncio.Future()  # run forever


if __name__ == "__main__":
	print("Starting websocket server...")
	asyncio.run(main())

