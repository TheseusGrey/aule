from dataclasses import dataclass


@dataclass
class Event:
    type: str
  
@dataclass
class ContextSwitchEvent:
    context: str
    type: str = 'context-switch'

@dataclass
class ListenEvent:
    prompt: str
    type: str = 'listen'

@dataclass
class SpeakEvent:
    message: str
    type: str = 'speak'