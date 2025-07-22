# Workshop - Agentic Compose

This workshop is designed to get you up and going with building agentic applications with Compose. This workshop assumes no familiarity with the GenAI stack and guides you through everything you need to know to get up and going!



## 📋 Workshop outline

Agentic applications need three things - **models**, **tools**, and **code** that glues them together. 

This workshop will walk through each of these topics and answer the following questions:

1. 🧠 Models
    - What are models? How do we interact with them?
    - What is the [Docker Model Runner](https://docs.docker.com/ai/model-runner/)?
    - How do I configure the Docker Model Runner in Compose?
    - How do I write code that connects to the Docker Model Runner?
2. 🛠️ Tools
    - What are tools? How do they work?
    - How does [MCP (Model Context Protocol)](https://modelcontextprotocol.io) fit in?
    - What is the [Docker MCP Gateway](https://docs.docker.com/ai/mcp-gateway/)?
    - How do I start a MCP Gateway?
    - How do I connect to the MCP Gateway in code?
3. 🧑‍💻 Code
    - What are agentic frameworks?
    - How do I define the models and tools my app needs in a Compose file?
    - How do I configure my app to use those models and tools?

By the end, you'll have gained experience using the Docker Model Runner and MCP Gateway in Compose to build a simple agentic application.


## Pre-requisites

This workshop utilizes the latest features of Docker. 

- **Easiest approach:** 🐳 Install [Docker Desktop 4.43.1+](https://docker.com)
- **Manual approach:** If you can't use Docker Desktop, you will need Docker Engine 28.3+, Docker Compose 2.38.1+, and Docker Model Runner 0.1.32+



## Getting started

1. Ensure the Docker Model Runner is running with the following command:

    ```console
    docker model status
    ```

2. Clone this repository to your machine:

    ```console
    git clone https://github.com/dockersamples/workshop-agentic-compose.git
    ```

3. Navigate into the directory for the cloned repository:

    ```console
    cd workshop-agentic-compose
    ```

4. Use Docker Compose to start the workshop environment:

    ```console
    docker compose up
    ```

    **Note:** this may take a while to download all of the required images and model. The model is about 2.9GB.

5. Once everything is done, open the bundled VS Code editor by going to [http://localhost:8085](http://localhost:8085). When prompted for a password, enter **password** as the password.

> [!IMPORTANT]
> When asked to run commands in the workshop, you will use the terminal **inside** this VS Code environment.


## Contributing

This workshop is being maintained by the Docker team. If you find typos or issues, feel free to submit a PR or open an issue. 

Note that we may not accept submissions that expand the scope of the workshop. If you have ideas though, feel free to start a discussion.
