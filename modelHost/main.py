import asyncio
import json

import torch
import websockets
from events.events import ContextSwitchEvent, ListenEvent, SpeakEvent
from transformers import AutoModelForCausalLM, AutoTokenizer

from modelHost.handlers.listenHandler import listen

device = "cuda"

tokenizer = AutoTokenizer.from_pretrained("PygmalionAI/pygmalion-6b")
model = AutoModelForCausalLM.from_pretrained("PygmalionAI/pygmalion-6b", torch_dtype=torch.float16)
model.to(device)


async def handler(websocket: websockets.WebSocketServerProtocol):
    while True:
        try:
            message = await websocket.recv()
            event = json.loads(message)
            match event:
                case ContextSwitchEvent():
                    return # This will update the context we're currently dealing with
                case ListenEvent():
                    response = listen(event.prompt, tokenizer, model, device)
                    await websocket.send(json.dumps(SpeakEvent(response))) 
                case other:
                    return # Default case, we'll just want to send some kind of, I didn't understand message back
        except websockets.ConnectionClosedOK:
            break


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
