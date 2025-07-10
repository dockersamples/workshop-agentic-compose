import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";
import { MCPClient } from "@mastra/mcp";

const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

export const mcp = new MCPClient({
  servers: {
    mcpGateway: {
        url: new URL(process.env.MCP_GATEWAY_URL || "http://mcp-gateway:8811/sse"),
    },
  },
});
 
export const jokeAgent = new Agent({
    name: 'Joke creator',
    instructions: `
      You are an AI agent that creates "dad jokes" based on the current time of year.
      You can assume the requester in the northern hemisphere. Therefore, if you see the current month is July, use a topic related to summer. If the current month is December, use a winter-related joke.
      Try to incorporate the number of the current hour somehow into the joke too.
      Your jokes should be light-hearted and suitable for all ages.
`,
  model: openai(process.env.OPENAI_MODEL || "gpt-4"),
  tools: await mcp.getTools(),
});