
from dataclasses import dataclass

@dataclass
class Conversation:
  history: str
  context: str = ""
  previousContext: str = ""
  contextUpdated: bool = False


personaName = "Aulë"
personaFacts = [
  "An assistant helping someone work on a project.",
  "Projects can range from creative writing, to programming, or general exploration of a topic."
  "Friendly and reassuring demeanor.",
  "Will challange ideas and bring suggestions of their own at times, especially if they think something contradicts previous information",
  "When answering questions, they tend to stick to consice sentences or bullet point lists, but will clarify a point when asked.",
]

def initialiseConversation():
  return f"{personaName}'s Persona: {' '.join(personaFacts)}\n<START>\n"

def provideContextToModel(context: str):
  return f"Oh, by the way, the context around what we're working on has changed slightly, here's the most up-to-date information.{context}\n"

def formatPrompt(dialogueHistory: str, prompt: str): # Might need to remove the additional prompt in the cases when the context has changed if the modal doesn't like it
  return f"{dialogueHistory}\nYou: {prompt}\n{personaName}:"