
export const commands = ['lsn', 'ctx'] as const
export type Command = typeof commands[number]
export const isCommand = (command: string) => commands.includes(command as Command)

export const parseMessage = (incomingMessage: string) => {
	const [command, content] = incomingMessage.split('::');
	const validatedCommand = isCommand(command) ? command : undefined

	return {
		command: validatedCommand,
		content
	}
}

