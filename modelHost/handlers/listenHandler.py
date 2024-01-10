from typing import Any
from transformers import PreTrainedTokenizer, PreTrainedTokenizerFast, Conversation

def listenHandler(conversation: Conversation, tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast, pipeline: Any):
	return pipeline(
		conversation,
		do_sample=True,
		top_k=10,
		num_return_sequences=1,
		eos_token_id=tokenizer.eos_token_id,
		max_length=200,
	)

