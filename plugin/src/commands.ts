import { Plugin } from "obsidian";
import Aule from "./main";

type Command = Parameters<Plugin['addCommand']>[0]

const commands = (app: Aule) => {
  const commands: Command[] = [
  {
  id: "aule-conversation-view",
  name: `Open Dialoge`,
  callback: () => app.toggleAssistantView()}
]

  return commands
}

export default commands
