# Design

- Wants code examples in the documentation site to be presented terminal-style (dark window chrome, language/type label, copy button, terminal look for shell command/output blocks) rather than plain light code blocks. Confidence: 0.6

- Styles code blocks per content type rather than one uniform look: `text`/output blocks should sit on a white background, while `go` code should look like a dark IDE/editor (VS Code–style: dark `#1e1e1e` body, editor header with traffic-light dots and a filename tab); picked "dark IDE" over a light editor when asked. Confidence: 0.8

- The filename tab on Go code blocks must be the literal lowercase `main.go` — filenames should not be uppercased or transformed by decorative text classes (explicitly re-requested after an `uppercase` class rendered it as `MAIN.GO`). Confidence: 0.8

- Wants Go code bodies syntax-highlighted (not monochrome) with a VS Code Dark+ palette: variables light blue (`#9CDCFE`), string/number values orange/green, operators/signs yellow (`#dcdcaa`), plus keywords, types, and italic comments; the copy button must still copy the raw uncolored source. Confidence: 0.8
