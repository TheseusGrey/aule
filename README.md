# Obsidian Writing Assistant

Two part project containing a websocket server that hosts a LLM (currently using the [pygmalion-2-7b](https://huggingface.co/PygmalionAI/pygmalion-2-7b) model), and a plugin for [Obsidian](https://obsidian.md/) that connects to the server and contains a chat window for conversations.

## Setup

When I get round to it I'll add some steps of things you need to install here in order to get the model and plugin up and running

## Usage

rough steps for now:
- `cd modelHost`
- Run the python virtual env (`.env/Scripts/activate` for windows)
- `python main.py` to start the websocket server

To run the plugin
- you'll need to repo to be located in your vaults plugin folder: `<VAULT_LOCATION>/.obsidian/plugins`
- `cd plugin`
- `npm run dev` will build the plugin (you can also build the plugin and move/symlink the output if you want the repo located somewhere else

## Extra notes

I've been running this on a 3060ti along side a bunch of other apps

- Initial response times can be around `~100-150` seconds but it can come down to as quick as `~10` seconds depending on the response size.
- I haven't tuned the parameters at all so the responses can be alil off sometimes. But generally the responses will make sense in an actual conversation
- I haven't tried to have any conversations longer than a couple messages yet, so I'm unsure how it will respond to and retain information for longer stretches.

## Beep Boop

If there is someone out there other than me looking at this repo, I'm leaving this project alone for a while. Primarily because local LLMs aren't currently feasible in a usecase that requires to keep up with you're ability to write your thoughts down. Not to mention when testing I've found LLMs definitely struggle with the novel output required for more creative writing tasks, I don't want to fight an LLM to get new ideas out of it.

