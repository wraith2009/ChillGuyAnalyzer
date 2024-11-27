import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());

const GITHUB_API_URL = "https://api.github.com/users/";

interface GitHubUser {
  login: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/analyze/:username", async (c) => {
  const username = c.req.param("username");

  const OPENAI_API_KEY = c.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key in environment variables.");
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  try {
    const githubRes = await fetch(`${GITHUB_API_URL}${username}`, {
      headers: { "User-Agent": "Hono" },
    });

    const githubContribution = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );
    interface ContributionResponse {
      total: object;
    }
    const response = (await githubContribution.json()) as ContributionResponse;
    const contributions = Object.values(response.total);
    const total = contributions.reduce(
      (total, contribution) => total + contribution,
      0
    );

    if (!githubRes.ok) {
      throw new Error(`GitHub user "${username}" not found.`);
    }

    const githubData = (await githubRes.json()) as GitHubUser;

    const prompt = `
      Here's some information about a GitHub user:
      - Username: ${githubData.login}
      - Bio: ${githubData.bio || "No bio provided"}
      - Public Repos: ${githubData.public_repos}
      - Followers: ${githubData.followers}
      - Following: ${githubData.following}
      -contributions : ${total}

      Write a witty analysis of this user, rate their "chillness" out of 100, and include some friendly roasting if necessary and give the chillness level it's must.
      the output must look like : {
      chillnessLevel : in regex ,
      description : their roast as well as the reason why you gave that chillness level
      }
    `;

    console.log(prompt);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a witty, fun, and mildly roasty assistant.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const description = chatCompletion.choices[0]?.message?.content?.trim();

    if (!description) {
      throw new Error("Failed to generate Chillguy Analyzer response.");
    }

    function parseToJson(inputString: any) {
      try {
        const cleanedString = inputString.replace(/\\n/g, "").replace(/\\/, "");

        const jsonObject = JSON.parse(cleanedString);
        return jsonObject;
      } catch (error) {
        console.error("Error parsing input string to JSON:", error);
        return null;
      }
    }

    const responseFromAPi = parseToJson(description);
    return c.json({
      username: githubData.login,
      responseFromAPi,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return c.json({ error: errorMessage }, 500);
  }
});

export default app;
