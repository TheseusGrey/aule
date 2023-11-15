from dataclasses import dataclass
from modelHost.utils.conversationHelpers import Context


@dataclass
class Event:
    type: str
  
@dataclass
class ContextSwitchEvent:
    context: Context
    type: str = 'context-switch'

@dataclass
class ListenEvent:
    prompt: str
    type: str = 'listen'

@dataclass
class SpeakEvent:
    message: str
    type: str = 'speak'