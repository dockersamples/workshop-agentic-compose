# Hands-on Two: Docker Model Runner

## Learning objectives

In this hands-on, you will complete the following objectives:

- Gain familiarity with using the Docker Model Runner via the CLI
- Interact with the Docker Model Runner using its OpenAI-compatible API endpoints

Let's get started!


## Segment One: The Docker Model Runner CLI

The Docker Model Runner CLI commands are designed to look familiar to the other Docker CLI commands. Let's explore a few of them!

1. To pull a model, use the `docker model pull` command:

    ```console
    docker model pull ai/gemma3-qat
    ```

    This command should exit fairly quickly since the model was pulled when you started the workshop environment.

    One key difference is that these models are pulled as [OCI Artifacts](https://docs.docker.com/docker-hub/repos/manage/hub-images/oci-artifacts/), which are similiar to container images. Most container registries also support OCI Artifacts.

2. If you want to learn more details about a model, you can use the `docker model inspect` command:

    ```console
    docker model inspect ai/gemma3-qat
    ```

    Running that will give you output similar to the following:

    ```json
    {
        "id": "sha256:b3752411b3bb15e4606609f9de8d525ee17c262efbec03d003d557edb1ae9b85",
        "tags": [
            "ai/gemma3-qat"
        ],
        "created": 1743777879,
        "config": {
            "format": "gguf",
            "quantization": "Q4_0",
            "parameters": "3.88 B",
            "architecture": "gemma3",
            "size": "2.93 GiB"
        }
    }
    ```

3. To run a single query against the model, use the `docker model run` command:

    ```console
    docker model run ai/gemma3-qat "Tell me an interesting fact"
    ```

    Once the model is loaded, you'll get a response!


## Segment Two: Using the OpenAI endpoints

Now, let's interact with the Docker Model Runner using the OpenAI API endpoints.

1. In the workshop editor, open the `02-docker-model-runner/index.js` file.

2. In that file, create an OpenAI client by adding the following code:

    ```javascript
    const OpenAI = require("openai");
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    This client setup allows configuration to be specified using the `OPENAI_BASE_URL` and `OPENAI_API_KEY` variables, allowing you to easily reconfigure the code to point to other APIs (including OpenAI itself).

    The workshop environment sets these defaults to point to Docker Model Runner.

3. Use the newly created client and send a basic request to it by adding the following code:

    ```javascript
    async function run() {
        const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a random fact giver based on a provided topic. Give one random fact and make it fun and interesting!`
            },
            {
                role: "user",
                content: `Countries of the world`
            }
            ]
        });
    
        return response.choices[0].message.content.trim();
    }

    run()
        .then(response => console.log(response))
        .catch(err => console.error(err));
    ```

    This snippet uses the `OPENAI_MODEL` environment to specify the model that should be used, making it easy to swap out.

4. Before running the code, open a new terminal and navigate into the directory:

    ```console
    cd 02-docker-model-runner
    ```

5. Install the openai library by using `npm install`:

    ```console
    npm install
    ```

6. Run the app:

    ```bash
    node ./index.js
    ```

    This example doesn't stream the response, so it may take a moment to get the full answer and display it (depending on your machine's hardware resources).

## Recap

In this hands-on, you accomplished the following:

- Learned about the Docker Model Runner CLI
- Learned how to connect the Docker Model Runner using the OpenAI client libraries
