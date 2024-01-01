export const formatContext = (context: string) => `<|system|>${context}`
export const formatMessage = (message: string, expectResponse?: boolean) => `<|user|>${message}${expectResponse && "<|model|>"}`

