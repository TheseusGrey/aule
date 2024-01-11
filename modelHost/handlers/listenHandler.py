from typing import Any, List, Dict
from transformers import PreTrainedTokenizer, PreTrainedTokenizerFast, Conversation

def formatConversation(messages: List[Dict[str, str]]):
	print(messages)
	return '\n'.join([f"<|{message['role']}|>{message['content']}" for message in messages])


def listenHandler(conversation: Conversation, tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast, pipeline: Any):
	formattedConversation = formatConversation(conversation.messages) + '<|assistant|>'
	return pipeline(
		formattedConversation,
		do_sample=True,
		top_k=10,
		num_return_sequences=1,
		eos_token_id=tokenizer.eos_token_id,
		max_length=200,
	)

