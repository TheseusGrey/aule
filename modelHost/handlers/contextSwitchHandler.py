from modelHost.utils.conversationHelpers import Context

def updateContext(oldContext: Context, newContext: Context):
    if oldContext.task == newContext.task:
        newContext.gatheredKnowledge += oldContext.gatheredKnowledge
    return newContext