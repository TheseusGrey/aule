from typing import Any
from transformers import PreTrainedTokenizer, PreTrainedTokenizerFast

def listen(prompt: str, tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast, model: Any, device: str):
    input = tokenizer(prompt, return_tensors='pt')
    input_tokens = {key: value.to(device) for key, value in input.items()}
    output = model.generate(**input_tokens, min_length=100, do_sample=True)
    return tokenizer.decode(output[0][len(input_tokens["input_ids"][0]):])
