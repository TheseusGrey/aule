from typing import Any
from transformers import PreTrainedTokenizer, PreTrainedTokenizerFast

def listenHandler(prompt: str, tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast, pipeline: Any, device: str):
	return pipeline(
		prompt,
		do_sample=True,
		top_k=10,
		num_return_sequences=1,
		eos_token_id=tokenizer.eos_token_id,
		max_length=200,
	)
    # input = tokenizer(prompt, return_tensors='pt')
    # input_tokens = {key: value.to(device) for key, value in input.items()}
    # output = model.generate(**input_tokens, min_length=100, do_sample=True)
	# return tokenizer.decode(output[0][len(input_tokens["input_ids"][0]):])
