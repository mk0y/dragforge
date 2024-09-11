import fs from "fs";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  return Response.json({ message: "GET request" });
}

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

export async function POST(request: Request) {
  const { query } = await request.json();
  console.log("Query:", query);
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
If not specified, the width of the component shouldn't be 100%, put something meaningful for the type of component. If it's a button, feel free to put some height as well.
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
    return Response.json({ componentName });
  }
  return Response.json({ message: "No content" });
}
