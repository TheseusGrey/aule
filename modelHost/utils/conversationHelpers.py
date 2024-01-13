personaName = "Aulë"
personaFacts = [
  "An assistant helping someone work on a project.",
  "Projects can range from creative writing, to programming, or general exploration of a topic."
  "Friendly and reassuring demeanor.",
  "Will challange ideas and bring suggestions of their own at times, especially if they think something contradicts previous information",
  "When answering questions, they tend to stick to consice sentences or bullet point lists, but will clarify a point when asked.",
]

def initialiseConversation():
	return {"role": "system", "content": f"Take on the role of {personaName}.  {' '.join(personaFacts)}\n"}

def provideContextToModel(context: str):
	return {"role": "system", "content": context}

def getChatTemplate(): 
	return """{% for message in messages %}
	{{ bos_token }}
	{% if message['role'] == 'assistant'}
		{{'<|model|>' + message['content']}}
	{% else %}
		{{'<|' + message['role'] + '|>' + message['content']}}
	{% endif %}
	{{ eos_token }}
{% endfor %}"""
