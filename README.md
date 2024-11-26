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

### Demos:

1. Page backgrounds:

https://www.youtube.com/watch?v=TmyDbPZELxc

### Roadmap

As of Nov. 17:

1. ~Remember row split position~ Needs adjustment to remember absolute positions.
2. ~Split using absolute values (currently it's by %)~ (For horizontal panels we should use %)
3. ~Fix components glitch in inventory~ - this seems to happen on dev mode sometimes, not on prod build
4. ~Split rows into columns~ (Also added add new rows)
5. ~Arrange panels actions with add/remove rows~
6. Remove components from canvas
7. ~Hide magic input field, to reduce distraction; possible solution: floating button~
8. Add row and column positioning (left, right, center, space between, space around)
9. Start working on header component, without sub-menus first
10. UX for big components, like headers, hero sections, sidebars, etc.
11. Refine components using prompt engineering
12. Add context menu on components to set basic stuff like absolute width and height
13. Improve drag handle UX
14. Add forms as components and add form actions to send to server
15. Add predefined form actions like sending emails with templates
16. Allow component nesting, e.g. add a button to some bigger component

Discussed Nov. 14
- Deployment with github actions
- Auth pages
- Decide we keep AWS or move to Fly.io on Monday Nov. 18
- Implement Auth
- Connect DB

Update Nov. 17:

Add rows and split columns is now possible using canvas sidebar buttons:

<img width="1779" alt="image" src="https://github.com/user-attachments/assets/169dcf39-7413-414e-93d2-7e095d8fcd92">

Update Nov. 26:

Added actions under magic input. First option added to describe page background.



