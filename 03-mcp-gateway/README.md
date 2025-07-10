# Hands-on Three: The Docker MCP Gateway

## Learning objectives

In this hands-on, you will complete the following objectives:

- Gain familiarity with using the Docker MCP Gateway
- Connect, list tools, and run a tool using MCP SDKs

Let's get started!


## Segment One: The Docker MCP Gateway

The [Docker MCP Gateway](https://github.com/docker/mcp-gateway) provides the ability to connect containerized MCP servers with your GenAI applications.

1. In the workshop editor, open a new terminal and navigate to this directory:

    ```console
    cd 03-mcp-gateway
    ```

2. Start a MCP Gateway that will provide a basic time server using the following command:

    ```console
    docker run -d --name=mcp-gateway --use-api-socket --network=workshop --network-alias=mcp-gateway docker/mcp-gateway --transport=sse --servers=time
    ```

    To explain this command:
      
    - **-d** - run the container in the background
    - **--name=mcp-gateway** - give the new container a specific name (helpful for cleanup later on)
    - **--use-api-socket** - this is a new flag that will mount the Docker socket, but also inject registry credentials
    - **--network=workshop --network-alias=mcp-gateway** - connect the new container to the network being used by the workshop and give it an alias (or DNS name) of `mcp-gateway`
    - **docker/mcp-gateway** - the name of the container image to run
    - **--transport=sse** - configure the MCP Gateway to use the SSE transport (MCP supports several communication transports)
    - **--servers=time** - the name of the MCP server to enable

3. To see the log output, use the `docker logs` command:

    ```console
    docker logs -f mcp-gateway
    ```
    
    You should see output similar to the following:
    
    ```plaintext
    - Reading configuration...
    - Reading catalog from https://desktop.docker.com/mcp/catalog/v2/catalog.yaml
    - Configuration read in 161.465501ms
    - Those servers are enabled: time
    - Using images:
    - mcp/time@sha256:9c46a918633fb474bf8035e3ee90ebac6bcf2b18ccb00679ac4c179cba0ebfcf
    > Images pulled in 21.214125ms
    - Verifying images [mcp/time]
    > Images verified in 1.807996584s
    - Listing MCP tools...
    - Running mcp/time with [run --rm -i --init --security-opt no-new-privileges --cpus 1 --memory 2Gb --pull never -l docker-mcp=true -l docker-mcp-tool-type=mcp -l docker-mcp-name=time -l docker-mcp-transport=stdio --network workshop]
    > time: (2 tools)
    > 2 tools listed in 312.322417ms
    > Initialized in 2.312126543s
    > Start sse server on port 8811
    ```

## Segment Two: Connecting to the MCP Gateway via code

Now that we have a MCP Gateway up and running, let's connect to it, query the available tools, and invoke a tool!

1. In the workshop editor, open the `03-mcp-gateway/index.js` file.

2. In the file, add the following inside the `main` function:

    ```javascript
    // Create a client
    const mcpClient = new Client({
        name: "mcp-gateway",
        version: "1.0.0",
    });

    // Create the transport using the SSE protocol
    const mcpTransport = new SSEClientTransport(new URL("http://mcp-gateway:8811/sse"));

    // Connect to the server
    await mcpClient.connect(mcpTransport);

    // Get and list the tools    
    const tools = await mcpClient.listTools();
    console.log('Available tools from MCP:', JSON.stringify(tools, null, 2));

    // Close the client
    await mcpClient.close();
    ```

4. Using the same terminal from before (which is in the `03-mcp-gateway` directory), install the dependencies:

    ```console
    npm install
    ```

5. Run the program to connect and list the tools being provided by the MCP Gateway:

    ```console
    node ./index.js
    ```

    If everything worked correctly, you should see output similar to the following:

    ```plaintext
    Available tools from MCP: {
    "tools": [
        {
            "name": "convert_time",
            "description": "Convert time between timezones",
            "inputSchema": {
                "type": "object",
                "properties": {
                "source_timezone": {
                    "description": "Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no source timezone provided by the user.",
                    "type": "string"
                },
                "target_timezone": {
                    "description": "Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'UTC' as local timezone if no target timezone provided by the user.",
                    "type": "string"
                },
                "time": {
                    "description": "Time to convert in 24-hour format (HH:MM)",
                    "type": "string"
                }
            },
            "required": [
                "source_timezone",
                "time",
                "target_timezone"
                ]
            },
            "annotations": {}
        },
        {
            "name": "get_current_time",
            "description": "Get current time in a specific timezones",
            "inputSchema": {
                "type": "object",
                "properties": {
                "timezone": {
                    "description": "IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'UTC' as local timezone if no timezone provided by the user.",
                    "type": "string"
                }
                },
                "required": [
                    "timezone"
                ]
            },
            "annotations": {}
        }
    ]
    }
    ```

6. Let's invoke one of the tools by adding the following _before_ the `await mcpClient.close();`:

    ```javascript
    const response = await mcpClient.callTool({ name: "get_current_time", arguments: { timezone: "America/New_York" } });
    const time = JSON.parse(response.content[0].text).datetime.trim();
    console.log(`The current time in New York is ${time}`);
    ```

7. If you run the app again, you'll now see a container start up using the `mcp/time` image (started by the MCP Gateway) and you'll see output similar to the following:

    ```plaintext
    The current time in New York is 2025-07-05T14:59:50-04:00
    ```

## Recap

In this hands-on, you accomplished the following:

- Gain familiarity with using the Docker MCP Gateway
- Connect, list tools, and run a tool using MCP SDKs

## Additional resources

- [The Docker MCP Gateway repo](http://github.com/docker/mcp-gateway)
- [Docker MCP Gateway configuration examples](https://github.com/docker/mcp-gateway/tree/main/examples)
