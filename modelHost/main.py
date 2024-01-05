import asyncio
from typing import Dict
from uuid import UUID

import torch
from utils.helpers import Context, processMessage
import websockets
from transformers import LlamaTokenizer, pipeline
from utils.conversationHelpers import Conversation, initialiseConversation

# App config
device = "cuda"
modelName = "PygmalionAI/pygmalion-2-7b"

# Model Initialisation
tokenizer = LlamaTokenizer.from_pretrained(modelName)
pipeline = pipeline(
    "text-generation",
    model=modelName,
    torch_dtype=torch.float16,
    device_map="auto",
)
# model = LlamaForCausalLM.from_pretrained("PygmalionAI/pygmalion-2-7b", torch_dtype=torch.float16, min_length=100, max_length=120)
# model.to(device)

# Websocket Connections
connections: Dict[UUID, Context]  = {}

# Message Handler
async def handler(websocket: websockets.WebSocketServerProtocol):
    if websocket.id not in connections:
        newConversation = Conversation(initialiseConversation())
        connections[websocket.id] = Context(websocket, newConversation)

    while True:
        try:
            message = await websocket.recv()

            assert isinstance(message, str)
            [eventType, messageContent] = message.split("::", 1)
            await processMessage(
				eventType,
				messageContent,
				connections[websocket.id],
				device,
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

