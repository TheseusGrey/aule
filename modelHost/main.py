import asyncio
import io
import json
from typing import Dict
from uuid import UUID

import torch
import websockets
from transformers import AutoModelForCausalLM, AutoTokenizer
from handlers.listenHandler import listen
from utils.conversationHelpers import Conversation, formatPrompt, initialiseConversation, provideContextToModel

# App config
device = "cuda"

# Model Initialisation
tokenizer = AutoTokenizer.from_pretrained("PygmalionAI/pygmalion-6b")
model = AutoModelForCausalLM.from_pretrained("PygmalionAI/pygmalion-6b", torch_dtype=torch.float16, max_length=120)
model.to(device)

# Websocket Connections
connections: Dict[UUID, Conversation] = {}

# Message Handler
async def handler(websocket: websockets.WebSocketServerProtocol):
    if websocket.id not in connections:
        connections[websocket.id] = Conversation(initialiseConversation())
    while True:
        try:
            message = await websocket.recv()
            print('Incoming message: "{}".'.format(message))
            assert isinstance(message, str)
            [eventType, data] = message.split("::", 1)

            match eventType:
                case "ctx":
                    connections[websocket.id].previousContext = connections[websocket.id].context
                    connections[websocket.id].context = data
                    connections[websocket.id].contextUpdated = True
                case "lsn":
                    prompt = data
                    if connections[websocket.id].contextUpdated:
                        connections[websocket.id].contextUpdated = False
                        prompt = provideContextToModel(str(connections[websocket.id].context)) + prompt
                    
                    response = listen(formatPrompt(connections[websocket.id].history, "You: " + prompt), tokenizer, model, device)
                    await websocket.send("lsn::{}".format(response)) 
                case _:
                    print("Unknown command, skipping...")
        except websockets.ConnectionClosedOK:
            connections.pop(websocket.id)
        except AssertionError as error:
            print("Unable to parse incoming message.")


async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    print("Starting websocket server...")
    asyncio.run(main())
