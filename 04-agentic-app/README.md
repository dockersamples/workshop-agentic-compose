# Hands-on Four: Agentic Compose

## Learning objectives

In this hands-on, you will complete the following objectives:

- Learn how to use Docker Compose to package an agentic application

Let's get started!


## Segment One: The sample app

The sample app in this directory uses the [Mastra](https://mastra.ai) agentic framework, which is a Typescript-based framework developed by Gatsby. It has many great features, including memory management, tool integration, and workflow execution.

In this simple application, we are exposing the agent using Express to produce time and location specific "dad jokes."

1. Open a new terminal and navigate to this directory:

    ```console
    cd 04-agentic-app
    ```

2. Take a look at the `src/mastra/agent.ts` file. A few key points to notice are:

    ```javascript
    const openai = createOpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    We are creating an OpenAI connection using configuration very similar to what we used earlier (easy to configure and change).

    ```javascript
    export const mcp = new MCPClient({
        servers: {
            mcpGateway: {
                url: new URL(process.env.MCP_GATEWAY_URL || "http://mcp-gateway:8811/sse"),
            },
        },
    });
    ```

    We are creating a MCP Client that will connect to an endpoint, very similar to what we were doing earlier.

    ```javascript
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
    ```

    This defines our agent, giving the system prompt and configuration for the model and tools to use.

3. Take a look at the `src/index.ts` file and look at the endpoint.

    It gets the agent from the Mastra framework and simply invokes it based on the provided query parameter to produce a joke.

4. To run it, first install the dependencies:

    ```console
    npm install
    ```

5. Start the application by using the `npm run dev` command:

    ```console
    npm run dev
    ```

    Once the app has started, you can go to [http://localhost:3030/joke?city=Berlin](http://localhost:3030/joke?city=Berlin) and get a time-aware joke about Berlin!

    You can also open the Mastra playground at [http://localhost:4111](http://localhost:4111) to explore the tooling Mastra provides and interact with the agent directly.


## Segment Two: Writing a Compose file

Now that we understand how the app works, let's package it up with Compose.

Remember that GenAI apps (including this one) typically need three things: models, tools, and code.

1. Open the `compose.yaml` file in the `04-agentic-app` directory.

2. Define the model the app needs to run by adding the following to the `compose.yaml`:

    ```yaml
    models:
      gemma3:
        model: ai/gemma3-qat
    ```

3. Now, we need to add our tools. We'll use the MCP Gateway container that we used earlier. Add the following to the Compose file:

    ```yaml
    services:
      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=sse --servers=time
        use_api_socket: true  
    ```

4. Finally, let's add our custom app! Add the following to the Compose file to tell Docker to build a container image and connect it to the model and MCP gateway:

    ```yaml
    services:
      mcp-gateway:
        ...
    # START COPYING HERE
      app: 
        build: ./
        models:
          gemma3:
            endpoint_var: OPENAI_BASE_URL
            model_var: OPENAI_MODEL
        ports:
          - 3080:3030
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/sse
          OPENAI_API_KEY: "not-required"
    ```

    The `endpoint_var` and `model_var` fields tell Compose the names of environment variables it should inject into the `app` container to help it connect to the model.

5. Validate your Compose file looks like this:

    ```yaml
    services:
      app: 
        build: ./
        models:
        gemma3:
          endpoint_var: OPENAI_BASE_URL
          model_var: OPENAI_MODEL
        ports:
          - 3080:3030
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/sse
          OPENAI_API_KEY: "not-required"

      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=sse --servers=time
        use_api_socket: true


    models:
      gemma3:
        model: ai/gemma3-qat
    ```

6. Now, run it using `docker compose up`:

    ```console
    docker compose up
    ```

    Within a moment, everything will be up and running and you can now access your app using [http://localhost:3080/joke?city=London](http://localhost:3080/joke?city=London)

You did it!

## Recap

In this hands-on, you accomplished the following:

- Gain familiarity with using the Docker MCP Gateway
- Connect, list tools, and run a tool using MCP SDKs

## Additional resources

- [The Docker MCP Gateway repo](http://github.com/docker/mcp-gateway)
- [Docker MCP Gateway configuration examples](https://github.com/docker/mcp-gateway/tree/main/examples)
