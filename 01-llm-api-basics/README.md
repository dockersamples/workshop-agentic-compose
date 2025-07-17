# Hands-on One: LLM API basics

## Learning objectives

In this hands-on, you will complete the following objectives:

- Learn about the OpenAI API endpoint used to create GenAI responses
- Understand the role of the system prompt

Let's get started!


## Segment One: Learning about messages

In this segment, you'll start with learning about the various messages in the stack that goes to the LLM API.

1. Open the Visual Chatbot by going to [http://localhost:3000](http://localhost:3000).

2. Type in a user message at the bottom of the screen and click the **Add message** button. A sample message is below:

    ```plaintext
    Why is the sky blue?
    ```

    You should notice that the response matches that from the system prompt - it is whimsical and has a fantasy-like feel.

3. Add another message that extends the previous question. For example, you might ask:

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


## Recap

In this hands-on, you accomplished the following:

- Learned about the OpenAI API endpoint used to create GenAI responses
- Understand the role of the system prompt
