# Developer Toolbox

Four focused tools for the small tasks between the big tasks. Responsive, accessible, and private by design.

- **JSON formatter** — format, minify, validate, copy, and download JSON. Two or four space indentation and Ctrl/Cmd + Enter.
- **Colour converter** — convert HEX, RGB, and HSL, use a colour picker, and copy values.
- **Markdown preview** — live preview with headings, lists, quotes, emphasis, links, and fenced code blocks. Raw HTML is escaped. This is a lightweight Markdown subset, not full GitHub Flavored Markdown.
- **Word counter** — words, Unicode characters, estimated sentences, paragraphs, and estimated reading time.
- Dark and light themes. Only the theme preference is stored. Editor content stays in memory and clears on refresh.

## Run locally

Requires Node.js 18 or newer. No dependency installation or build step.

```sh
node server.cjs
```

Open http://127.0.0.1:4173. Run checks with `node --test tests/core.test.cjs`. If npm is installed, `npm start` and `npm test` work too.

## Structure

`docs/` is the complete deployable site. `core.js` contains pure conversion and rendering functions, `app.js` handles interactions, and `style.css` contains responsive themes. The first version uses plain JavaScript to remain small and dependency-free.

## Contribute

Open an issue describing the problem or feature, create a branch, and submit a focused pull request. Include a brief description and verification steps. Credit real collaborators with a `Co-authored-by` commit trailer when appropriate.

Potential next features: JSON file import, Markdown tables, colour contrast checker, and automated browser checks.

## Privacy

All tool processing happens in the browser. No analytics, external fonts, APIs, or third-party scripts are used. The hosting provider receives ordinary page requests. Clipboard access requires a secure context or localhost.

## License

MIT — see LICENSE.

