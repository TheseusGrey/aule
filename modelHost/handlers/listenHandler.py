from typing import Any, List, Dict
from transformers import PreTrainedTokenizer, PreTrainedTokenizerFast, Conversation

def formatConversation(messages: List[Dict[str, str]]):
	conversationText = ""
	for message in messages:
		conversationText += f"<|{message['role']}|>{message['content']}<|{message['role']}|>\n"

	return conversationText

def listenHandler(conversation: Conversation, tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast, pipeline: Any):
	# formattedConversation = formatConversation(conversation.messages) + '<|model|>'
	return pipeline(
		conversation,
		# formattedConversation,
		do_sample=True,
		top_k=10,
		num_return_sequences=1,
		eos_token_id=tokenizer.eos_token_id,
		max_new_tokens=128
	)

