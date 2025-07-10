# Workshop - Agentic Compose

This workshop is designed to get you up and going with building agentic applications with Compose. This workshop assumes no familiarity with the GenAI stack and guides you through everything you need to know to get up and going!

## Pre-reqs

In order to run this workshop, you need the following:

1. Install [Docker Desktop 4.43.1+](https://docker.com)
    - If you can't use Docker Desktop, you need Docker Engine 28.3+, Docker Compose 2.38.1+, and Docker Model Runner 0.1.32+

1. Ensure the Docker Model Runner is running with the following command:

    ```console
    docker model status
    ```

2. Clone this repository to your machine

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

