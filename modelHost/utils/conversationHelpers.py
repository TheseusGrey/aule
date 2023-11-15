
from dataclasses import dataclass
from typing import List, Optional



@dataclass
class Context:
    device: Optional[str] = None
    application: Optional[str] = None
    subject: Optional[str] = None
    task: Optional[str] = None
    subTask: Optional[str] = None
    activeFocus: Optional[str] = None
    gatheredKnowledge: List[str] = []
    def __str__(self) -> str:
        return f"""
- Device: {self.device}
- Application: {self.application}
- Subject: {self.subject}
- Task: {self.task}
- Subtask: {self.subTask}
- Active Focus: {self.activeFocus}
- Gathered Knowledge: {" ".join(self.gatheredKnowledge)}
"""

@dataclass
class Conversation:
  history: str
  context: Context
  contextUpdated: bool = False


personaName = "Aulë"
personaFacts = [
  "An assistant helping someone work on a project.",
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