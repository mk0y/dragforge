"use server";
import fs from "fs";
import { readdir } from "fs/promises";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendQuery = async (formData: FormData) => {
  const query = formData.get("query");
  const data = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    body: JSON.stringify({ query }),
  }).then((res) => res.json());
  console.log("Data:", data);
};

export const sendGPTQuery = async (query: string) => {
  const writeToFile = (content: string) => {
    const trimmedContent = content
      .trim()
      .replace(/^\`\`\`[a-z]*\n/, "")
      .replace(/\n\`\`\`$/, "");
    const finalContent = `"use client";\n\n${trimmedContent}`;
    const exportDefaultMatch = finalContent.match(
      /export\s+default\s+([A-Za-z0-9_]+)/
    );
    const componentName = exportDefaultMatch
      ? exportDefaultMatch[1]
      : "UnknownComponent";
    fs.writeFileSync(`src/components/gen/${componentName}.tsx`, finalContent);
    return componentName;
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          // "You are an expert frontend developer with deep knowledge in React and CSS. I will ask you a few questions and you will provide Typescript code snippets with 2 spaces indentation as answers. No explanations needed since I'm also a developer and I will understand the code.",
          `I want you to act as a frontend developer and generate functional React components.
You write code in Typescript.
Components should be styled using classNames from TailwindCSS.
Code indentation will be 2 spaces.
The components should be ready to use, with clean and modern designs that require minimal tweaks.
Focus on creating reusable and responsive components that follow best practices for React.
Ensure the components are visually appealing and functional for common use cases in web applications.
The components should be self contained, with no external dependencies except for lucide-react.
Use icons from lucide-react. Take colors into account, if the color is not specified, use the black/white color combinations.
Components should have background color, border color, text color, icon color and shadow, where applicable.
No explanations needed since I'm also a developer and I will understand the code.
Don't write any example code, just the code.
Don't import any CSS files.`,
      },
      {
        role: "user",
        content: query,
      },
    ],
    model: "gpt-4o-mini",
  });
  const content = chatCompletion.choices[0].message.content;
  if (content) {
    const componentName = writeToFile(content);
    return { componentName };
  }
  return {};
};

export const readGenFiles = async () => {
  const files = await readdir(`${__dirname}/../components/gen`);
  const fileNamesWithoutExtensions = files.map(
    (file: string) => path.parse(file).name
  );
  return [...fileNamesWithoutExtensions];
};
