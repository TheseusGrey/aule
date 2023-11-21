import asyncio
import json
from typing import Dict
from uuid import UUID

import torch
import websockets
import ssl
from events.events import ContextSwitchEvent, ListenEvent, SpeakEvent
from transformers import AutoModelForCausalLM, AutoTokenizer
from handlers.contextSwitchHandler import updateContext
from handlers.listenHandler import listen
from utils.conversationHelpers import Context, Conversation, formatPrompt, initialiseConversation, provideContextToModel

device = "cuda"

# tokenizer = AutoTokenizer.from_pretrained("PygmalionAI/pygmalion-6b")
# model = AutoModelForCausalLM.from_pretrained("PygmalionAI/pygmalion-6b", torch_dtype=torch.float16)
# model.to(device)

connections: Dict[UUID, Conversation] = {}

async def handler(websocket: websockets.WebSocketServerProtocol):
    # if websocket.id not in connections:
    #     connections[websocket.id] = Conversation(initialiseConversation(), Context())
    while True:
        try:
            message = await websocket.recv()
            print(message)
            # message.split("::", 1)
            # event = json.loads(message)
            # match event:
            #     case ContextSwitchEvent():
            #         oldContext = connections[websocket.id].context
            #         connections[websocket.id].context = updateContext(oldContext, event.context)
            #         connections[websocket.id].contextUpdated = True
            #     case ListenEvent():
            #         prompt = event.prompt
            #         if connections[websocket.id].contextUpdated:
            #             connections[websocket.id].contextUpdated = False
            #             prompt = provideContextToModel(str(connections[websocket.id].context)) + event.prompt
                    
            #         response = listen(formatPrompt(connections[websocket.id].history, "You: " + prompt), tokenizer, model, device)
            #         await websocket.send(json.dumps(SpeakEvent(response))) 
            #     case other:
            #         return # Default case, we'll just want to send some kind of, I didn't understand message back
        except websockets.ConnectionClosedOK:
            pass
            # connections.pop(websocket.id)


async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    print("Starting websocket server...")
    asyncio.run(main())
