"use server";
import fs from "fs";
import { readdir } from "fs/promises";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";
import {
  askGPTWhichComponentsToUse_Completion,
  assembleComponentsUsingGPT_Completion,
} from "./completions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateComponentFromGPT = async (query: string) => {
  const { content: componentsCommaStr } =
    await askGPTWhichComponentsToUse_Completion(query);
  const componentNames = componentsCommaStr?.split(",").map((s) => s.trim());
  if (componentNames && componentNames[0]) {
    const componentStr = fs.readFileSync(
      `src/components/palette/${componentNames[0]}.tsx`,
      "utf-8"
    );
    const { content } = await assembleComponentsUsingGPT_Completion(
      query,
      componentNames[0],
      componentStr
    );
    return { content };
  } else {
    return {};
  }
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
          `I want you to act as a senior frontend developer and generate functional React components.
You write code in Typescript.
Components should be styled using classNames.
Code indentation will be 2 spaces.
The components should be ready to use, with clean and modern designs that require minimal tweaks.
Focus on creating reusable and responsive components that follow best practices for React.
Ensure the components are visually appealing and functional for common use cases in web applications.
The components should be self contained, with no external dependencies except for lucide-react.
Use icons from lucide-react. Take colors into account, if the color is not specified, use the black/white color combinations.
Components should have background color, border color, text color, icon color and shadow, where applicable.
No explanations needed since I'm also a developer and I will understand the code.
Don't write any example code, just the code.
If you want to use primitive component from shadcn you can import it as: \`import { Button } from "@/components/ui/button";\`. Or import { Textarea } from "@/components/ui/textarea";\`. And so forth. Don't make up relative imports like \`import { Button } from "./Button";\` to fake it, use explicitly this \`"@/components/ui/Component"\` location notation.
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

export const generateRandomComponentQuery = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `I want you to act as a frontend developer.
I will ask you to generate a text which will instruct someone what component to build.
For example:
Example 1: A header with logo on the left. Don't put image in the logo, just write "Logo". On the right should be menu items "Dashboard", "Docs", "Pricing", "Blog". Header should drop some shadow to the bottom.
Or:
Example 2: A button with blue-green gradient from top to bottom. Text color should be white. No borders. On hover it should zoom in just a tiny bit.
These examples are for random React component descriptions that I want to give to someone so they can make them.
It can be about anything, like Button, Accordion, Container, Avatar, Alert, Checkbox, Badge, Combobox, Calendar, Carousel, Collapsible, Context Menu, Date Picker, Drawer, Menu Bar, Radio Group, Form, Progress Bar, Hover Card, etc.
Always give the component its width and height. Never use h-screen, use h-full instead.
Be more creative, don't always create Card component. Never create Modal component.
Always create components with relative position. Children can have other position values, but main component should always have position "relative".
Never assume we have any other module installed except "react" and "lucide-react". For example, this is wrong \`import { useOutsideClick } from '@chakra-ui/react';\` because we don't have "@chakra-ui" installed.
Always hardcode elements inside the component, never assume there are component arguments like \`({ items })\`.
Always give the component a background, never use transparent background.
Developers notes:
1. 'onKeyPress' is deprecated. Use 'onKeyDown' instead.
2. This is wrong syntax for rendering children: \`<span className="text-xl">{MenuIcon}</span>\`; this is correct \`<span className="text-xl"><MenuIcon /></span>\`.
3. This is wrong import \`import { Link } from "react-router-dom";\`, never use "react-router-dom". Always use <a> tags.
`,
      },
      {
        role: "user",
        content: "Please generate for me a random React component description.",
      },
    ],
    model: "gpt-4o-mini",
  });
  const content = chatCompletion.choices[0].message.content;
  if (!content) {
    return { content: "" };
  }
  return { content };
};

export const readGenFiles = async () => {
  const files = await readdir(`${__dirname}/../components/gen`);
  const fileNamesWithoutExtensions = files.map(
    (file: string) => path.parse(file).name
  );
  return [...fileNamesWithoutExtensions];
};
