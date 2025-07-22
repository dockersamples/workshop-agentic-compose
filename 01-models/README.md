# Hands-on One: Models

## Learning objectives

In this hands-on, you will complete the following objectives:

- Learn about the OpenAI API endpoint used to create GenAI responses
- Understand the role of the system prompt
- Learn how to use the Docker Model Runner
- Connect an app to the Docker Model Runner

Let's get started!


## Segment One: Models and messages

When interacting with models, we interact with an API that wraps the model. In this segment, you'll start with learning about the various messages that goes to the LLM's API.

1. Open the Visual Chatbot opening [http://localhost:3000](http://localhost:3000).

2. You'll see in the chat area a "system prompt", which sets the persona for the interaction with the model (more on this in the next section).

3. Type the following message in the chat box at the bottom of the screen and click the **Add message** button:

    ```plaintext
    Why is the sky blue?
    ```

    You should notice that the response matches that from the system prompt - it is whimsical and has a fantasy-like feel.

4. Add another message that extends the previous question. For example, you might ask:

    ```plaintext
    Are there times in which it has other colors?
    ```

    If this message were submitted on its own, it would be missing a lot of context - what are we referring to? What colors have already been referenced?

    However, when we submit the message, we get a response back that indicates the model is following the thread.

    This is because the entire stack of messages is being submitted for each and every interaction with the model.

> [!IMPORTANT]
> Models have no notion of memory or history on their own - **they are stateless.** All messages in the stack are sent to the API in order to support history and context. This is why context length is an important consideration.



## Segment Two: The system prompt

For this segment, we're going to explore the importance of the system prompt. In most cases, when you hear about prompt engineering, it's focusing on crafting the system prompt.

1. In the Visual Chatbot, go to the **Settings** -> **System prompt** menu.

2. In the dialog that appears, select the **Grumpy old man** option in the _Quick persona chooser_ area. You should see the prompt updated with a new description.

3. Enable the **Replay user messages on new system prompt** option.

4. Click the **Save** button to save the new prompt.

    What you should see now is a very short and terse response back from the model.

5. Go back into the **System prompt** chooser and now select the **Message summarizer** option.

6. Click the **Reset messages** button to start a new conversation.

7. Copy the following JSON, paste it into the message field, and then click **Add message**.

    ```json
    [
        { 
            "author": "Jane",
            "timestamp": "2025-07-08 14:29",
            "message": "Can you help me create the blog post for the launch?"
        },
        {
            "author": "Jane",
            "timestamp": "2025-07-08 15:32",
            "message": "Hello? Haven't heard back from you. Can you help?"
        },
        {
            "author": "Jane",
            "timestamp": "2025-07-08 16:12",
            "message": "Never mind. We used some of the PMM materials and created the post"
        }
    ]
    ```

    What you should see is a summary of the text thread, indicating no action is now required.

> [!IMPORTANT]
> The same model can be used in a variety of ways, depending on the provided system prompt. Many models also work well with a variety of input data.



## Segment Three: The Docker Model Runner CLI

Now that we understand how models work, how does Docker help us use models?

The Docker Model Runner provides the ability to run models.

The Docker Model Runner CLI commands are designed to look familiar to the other Docker CLI commands. Let's explore a few of them!

1. In the workshop editor, open a new terminal (go to the **Terminal** settings and select **New Terminal**).

2. Pull a model by using the `docker model pull` command:

    ```console
    docker model pull ai/gemma3-qat
    ```

    This command should exit fairly quickly since the model was pulled when you started the workshop environment.

    These models are pulled as [OCI Artifacts](https://docs.docker.com/docker-hub/repos/manage/hub-images/oci-artifacts/), which are similar to container images. Most container registries also support OCI Artifacts, allowing you to mirror models or distribute your own using other registries.

3. To learn more details about a model, you can use the `docker model inspect` command:

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

    The parameter and quantization details of the model are useful when determining a model to use.

4. To run a single query against the model, use the `docker model run` command:

    ```console
    docker model run ai/gemma3-qat "Tell me an interesting fact"
    ```

    Once the model is loaded, you'll get a response!



## Segment Four: Connecting to the Docker Model Runner in an app

The Docker Model Runner exposes models using an OpenAI-compatible API, making it easy to integrate into your codebase. Any library that supports OpenAI will be able to support the Docker Model Runner.

In this segment, you will use the [openai](https://www.npmjs.com/package/openai) library to connect to the model and perform a simple request.

1. In the workshop editor, open the `01-models/index.js` file.

2. In that file, create an OpenAI client by adding the following code:

    ```javascript
    const OpenAI = require("openai");
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    This client is configured to use the `OPENAI_BASE_URL` and `OPENAI_API_KEY` variables, making it easy to reconfigure the code to point to other APIs (including OpenAI itself).

    The workshop environment sets these defaults to point to Docker Model Runner. Later in the workshop, you'll see how Compose can define and inject these values into the app.

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

    This snippet uses the `OPENAI_MODEL` environment to specify the model that should be used, making it easy to reconfigure to use another model.

4. Before running the code, open a new terminal and navigate into the directory:

    ```console
    cd 01-models
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

And with that, you've learned a little bit about models, how they work, and how to use the Docker Model Runner in a simple application.



## Next steps

Now that you know the basics about models, it's time to explore tools!

[Go to the tools hands-on](../02-tools-and-mcp)
