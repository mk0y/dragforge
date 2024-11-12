import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askGPTWhichComponentsToUse_Completion = async (query: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `User will ask you to build a React component.
Based on user's request you will only return a list of components you would use for building the UI.
Don't build the UI yet.
We have following components which we can use: Button, Input, Select or DropdownMenu, Textarea.
Please return just comma separated list of components you would use. For example: Button. Or Button, Input.`,
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
    return { content };
  }
  return {};
};

export const assembleComponentsUsingGPT_Completion = async (
  query: string,
  componentName: string,
  componentStr: string
) => {
  const prompt = `You act as a senior frontend React developer.
No explanations needed since I'm also a developer and I will understand the code.
You will only use the following components to fulfil the user's request:

${componentName} component's tsx file:

\`\`\`tsx
${componentStr}
\`\`\`

We call them Base components.
Components should be styled using className based on TailwindCSS.
Please use Base components to construct a component to be used by the user.
You should produce for example: \`<Button size="small" className="bg-green-700 rounded-md">Click me</Button>\`.
The purpose of this task is for users to have appealing components production ready to be used in their projects.
Always try to use animations and shadows where applicable to have modern look and feel.
Take all the instructions into consideration, don't omit anything, like paddings, colors, borders, everything that is requested must be included for styling. Think twice.
Don't wrap the component with \`\`\`tsx.`;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
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
    return { content };
  }
  return {};
};
