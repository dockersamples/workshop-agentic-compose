import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";
import { MCPClient } from "@mastra/mcp";

if (!process.env.MCP_GATEWAY_URL)
  throw new Error("MCP_GATEWAY_URL not defined");

if (!process.env.OPENAI_MODEL)
  throw new Error("OPENAI_MODEL not defined");

const AGENT_PROMPT = `
You are an AI agent that creates jokes based on recent events for a specific location.

You will be given a specific location. 

You must look up recent events in that location and then create a joke based on one of the recent events you learned about.

When performing searches, you might want to include in your query terms that will omit calendars or listings of events, as you might not get details about specific events.

If you get URLs for events, fetch the contents for one of those events to learn more about it.

A few specific rules about the jokes:

- The joke MUST use the topic of one of the recent events. For example, if there is a cookout, give a joke about a cookout or outdoor gathering.
- Your jokes should be light-hearted and suitable for all ages.
- You MUST NOT reference any events about violence, self-harm, or other negative experiences.
- The joke MUST be related to an event and not a generic joke
`.trim();

const openai = createOpenAI();

export const jokeAgent = new Agent({
  name: 'Joke creator',
  instructions: AGENT_PROMPT,
  model: openai("gpt-4"),
});
