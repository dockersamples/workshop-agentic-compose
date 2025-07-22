# Hands-on Three: Agentic apps with Compose

## Learning objectives

In this hands-on, you will complete the following objectives:

- Learn how to use Docker Compose to define the models and tools required by an agentic application
- Update the application to connect to the models and tools provided by Compose

Let's get started!


## The sample app

The sample app we're going to create is an agent that creates jokes about recent events in a specific location. The agent will look up recent events and then use them to generate a light-hearted joke.

The app will use the [Mastra](https://mastra.ai) agentic framework, which is a Typescript-based framework developed by Gatsby. It has many great features, including memory management, tool integration, and workflow execution.

In this simple application, we are exposing the agent using Express to produce time and location specific "dad jokes."



## Segment One: Setting up the Compose file

The first thing we'll do is create a Compose file that defines the model and MCP tools the application is going to use.

1. Open the `compose.yaml` file in the `03-agentic-app` directory.

2. Define the model the app needs to run by adding the following to the `compose.yaml`:

    ```yaml
    models:
      gemma3:
        model: ai/gemma3-qat
    ```

3. Now, we need to add our tools. We'll use the MCP Gateway container that we used earlier. Add the following to the Compose file after the `models` config:

    ```yaml
    services:
      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=sse --servers=duckduckgo
        use_api_socket: true  
    ```

4. Finally, let's add our custom app! Add the following to the Compose file to tell Docker to build a container image and connect it to the model and MCP gateway:

    ```yaml
    services:
      mcp-gateway:
        ...
    # START COPYING HERE
      app: 
        build:
          context: ./
          target: dev
        models:
          gemma3:
            endpoint_var: OPENAI_BASE_URL
            model_var: OPENAI_MODEL
        ports:
          - 3080:3030
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/sse
          OPENAI_API_KEY: "not-required"
        develop:
          watch:
            - path: ./src
              action: sync
              target: /usr/local/app/src
    ```

    The `endpoint_var` and `model_var` fields tell Compose the names of environment variables it should inject into the `app` container to help it connect to the model.

    The `MCP_GATEWAY_URL` environment variable will be used by the app to know how to connect to the MCP server.

5. Validate your Compose file looks like this:

    ```yaml
    models:
      gemma3:
        model: ai/gemma3-qat

    services:
      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=sse --servers=time
        use_api_socket: true

      app: 
        build:
          context: ./
          target: dev
        models:
          gemma3:
            endpoint_var: OPENAI_BASE_URL
            model_var: OPENAI_MODEL
        ports:
          - 3080:3030
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/sse
          OPENAI_API_KEY: "not-required"
        develop:
          watch:
            - path: ./src
              action: sync
              target: /usr/local/app/src
    ```

6. Now, run it using `docker compose up --watch`:

    ```console
    docker compose up --watch
    ```

    The `--watch` flag will start Compose Watch, which will be used to sync files into the container as we make changes.

    Within a moment, everything will be up and running and you can now access your app using [http://localhost:3080](http://localhost:3080)

If you try to use the app, you'll see that it doesn't work... yet. We need to update the application to connect to the models and tools.


## Segment Two: Connecting the agent to the models and tools

As we saw in the Compose file, the `OPENAI_BASE_URL`, `OPENAI_MODEL`, and `MCP_GATEWAY_URL` environment variables are being defined. Now, we update the code to use them.

1. Open the `src/mastra/agent.ts` file. This is where the agent is being defined.

2. After the prompt definition, add the following to configure the OpenAI client to connect to the Docker Model Runner:

    ```javascript
    const openai = createOpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    This is creating an OpenAI client and configuring it to use the base URL defined in the environment variable. If it isn't set, the library will default to the standard OpenAI API endpoints.

    In our Compose file, we defined `OPENAI_API_KEY` and set it to `not-required` as many libraries require the API key to be set, even if it isn't required.

3. After the previous snippet you just added, add the following to create a MCP client that will connect to the gateway.

    ```javascript
    if (!process.env.MCP_GATEWAY_URL)
      throw new Error("MCP_GATEWAY_URL not defined");

    export const mcp = new MCPClient({
        servers: {
            mcpGateway: {
                url: new URL(process.env.MCP_GATEWAY_URL),
            },
        },
    });
    ```

4. Finally, update the agent to use the model client and tools. Update the `model` and add the `tools` configuration to make the code look like this:

    ```javascript
    export const jokeAgent = new Agent({
      name: 'Joke creator',
      instructions: AGENT_PROMPT,
      model: openai(process.env.OPENAI_MODEL || "gpt-4"),
      tools: await mcp.getTools(),
    });
    ```

5. Go back to [http://localhost:3080](http://localhost:3080) and give it a try now!

    The app should work! You should see a new joke get generated and the MCP Gateway executions in the log output.

If you'd like, feel free to make changes to the agent's prompt to change how it operates.

> [!IMPORTANT]
> One incredible feature of the Mastra framework is the Mastra playground. With this playground, you can interact with the agent directly, test prompts, make changes, and more. Access it in this lab by going to [http://localhost:4111](http://localhost:4111).


## Cleaning up

When you're done with this hands-on, complete these steps to stop everything that's running:

1. In the terminal running Compose, press `Ctrl+C` to stop the stack. You should see everything stop and tear down.


## Recap

In this hands-on, you accomplished the following:

- Learned how to write a Compose file that specifies the required models and tools for a project
- Updated code to connect to the model and tools provided by the Compose stack



## Additional resources

- [The Docker MCP Gateway repo](http://github.com/docker/mcp-gateway)
- [Docker MCP Gateway configuration examples](https://github.com/docker/mcp-gateway/tree/main/examples)
