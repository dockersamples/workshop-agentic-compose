import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { mastra } from "./mastra";

const app = express();
const port = process.env.PORT || 3030;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/express/index.html");
});

app.get('/joke', async (req, res) => {
  const { city } = req.query as { city?: string };
 
  if (!city) {
    return res.status(400).send("Missing 'city' query parameter");
  }

  const agent = mastra.getAgent("jokeAgent");

  try {
    const result = await agent.generate(`Tell me a joke about a recent event in ${city}`);
    return res.json({ joke: result.text });
  } catch (error) {
    console.error("Error generating joke:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});