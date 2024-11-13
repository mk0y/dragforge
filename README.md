# Dragforge

## Getting Started

Install dependencies:

```bash
npm i
# or
yarn
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Useful prompts:

So far we've built support for Buttons, Inputs and DropdownMenu or Select.

Some useful prompts that we tested:

```
A button with paddings and white text, with gradient background from top blue to bottom green, with 0.5rem border radius.
```

```
An input text field with placeholder "Hi there!", paddings, and with fully rounded borders with transparent background and weak white border colour. When it's in focus border should shine strong white with a transition effect, and no outline ring please.
```

```
A dropdown menu to choose from following items: "Red", "Green", "Blue". Dropdown menu should have dark background and light text. It should have a separator line between the items. Each item's on hover background should lean towards to color that matches its name, e.g. red for "Red".
```

Using similar approach it's possible to use variety of different structures and styles.

### Roadmap

1. Remember row split position
2. Split using absolute values (currently it's by %)
3. Fix components glitch in inventory
4. Split rows into columns
