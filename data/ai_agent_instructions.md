# `/data` — Content Schema & Manipulation Guide

This directory holds **all the editable content** for the portfolio website. The React
components read these JSON files directly and render the site from them. To "complete"
the website, an agent only needs to fill in / rewrite the values in these files — no
component code needs to change.

> **Golden rule:** Only edit the JSON files in this directory. Keep every file as
> **valid JSON** (double-quoted keys and strings, no comments, no trailing commas).
> Do not add or remove top-level keys unless this guide says a key is optional.

---

## File index

| File              | Drives which part of the site | Shape            |
| ----------------- | ----------------------------- | ---------------- |
| `site.json`       | Global: name, header, sidebar, About intro, education, nav, banner, footers, socials | Single object |
| `experience.json` | The **Experience** section    | Array of objects |
| `academics.json`  | The **Academics** section     | Array of objects |
| `projects.json`   | The **Projects** section      | Array of objects |

Assets referenced from these files (logos, headshot, resume) live under `/public`.
Any path like `/logos/uw_logo.png` resolves to `public/logos/uw_logo.png`.

---

## Special text syntaxes (IMPORTANT)

Some string fields support lightweight inline markup. Using the wrong syntax in the
wrong field will render literal characters, so match them exactly.

### 1. Color-highlight syntax — **`site.intro` only**
Format: `[shown text](color)` where `color` is one of **`yellow`, `blue`, `orange`, `green`**.
Rendered as an animated colored highlight span.

```
"I study [Mathematics](yellow) and love [optimization](blue)."
```
- Only these four color words are valid. Any other word in the `(...)` is ignored (renders as plain text).
- This syntax is **NOT** a link. Do not put URLs here.

### 2. Inline markdown — banner, contact bars, footers
Supported in `banner.text`, `contactBar.text`, `contactBar2.text`, `ultraFooter.text`:
- `**bold**` → bold
- `` `code` `` → inline code
- `[label](https://url)` → link (opens in new tab if it starts with `http`)

```
"**Open to Summer 2026 internships** — [Reach out →](mailto:you@email.com)"
```
- Note: `contactBar` (the header one) **strips** link markup and shows only the label text; `contactBar2` (footer) renders full links. Prefer `contactBar2` for clickable contact info.

### 3. Plain text — everything else
All other fields (summaries, descriptions, titles, degrees, etc.) are **plain text**.
Do not use markdown or highlight syntax in them; it will render literally.

---

## `site.json`

A single JSON object. Field-by-field:

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | Your full name. Shown in sidebar, header, browser tab title. |
| `role` | string | yes | Short tagline under your name in the sidebar/mobile header. |
| `description` | string | yes | Used as the site `<meta description>` (SEO). Plain text, ~1–2 sentences. |
| `headshot` | string (path) | yes | Path under `/public`, e.g. `/headshots/headshot.png`. |
| `banner` | object | yes | Dismissible top banner. See below. |
| `contactBar` | object | yes | Header contact line. Link markup is stripped to plain text. |
| `contactBar2` | object | yes | Footer contact line. Full inline markdown (links work). |
| `footer` | string | yes | Plain-text closing line in the footer. If empty/missing the footer hides. |
| `ultraFooter` | object | yes | Tiny credit line at the very bottom. Inline markdown supported. |
| `intro` | string[] | yes | About-section paragraphs. Supports **color-highlight syntax**. One string per paragraph. |
| `education` | object[] | yes | Cards in the About section. See below. |
| `navigation` | object[] | yes | Header/sidebar nav links. See below. |
| `socials` | object | yes | `linkedin`, `github`, `resume` URLs/paths. |

### `banner` / `contactBar` / `contactBar2` / `ultraFooter` (visibility toggles)
Each is `{ "visible": boolean, "text": string }`.
- Set `"visible": false` to hide that element without deleting its text.
- `text` supports **inline markdown** (see syntax section).

```json
"banner": {
  "visible": true,
  "text": "**Open to Summer 2026 internships** — [Reach out →](mailto:you@email.com)"
}
```

### `education[]`
```json
{ "degree": "Honour Bachelor's ... Co-op", "school": "University of Waterloo", "logo": "/logos/uw_logo.png" }
```
| Field | Type | Notes |
| ----- | ---- | ----- |
| `degree` | string | Bold line on the card. |
| `school` | string | Muted subline; also used as the React key (keep unique). |
| `logo` | string (path) | Image under `/public`. |

### `navigation[]`
```json
{ "label": "Experience", "href": "#experience", "visible": true }
{ "label": "Resume", "href": "/pranav_joshi_resume.pdf", "external": true, "visible": true }
```
| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `label` | string | yes | Link text. |
| `href` | string | yes | In-page anchors are `#about`, `#experience`, `#academics`, `#projects`. External uses full URL or a `/public` path. |
| `external` | boolean | no | `true` opens in a new tab (use for Resume, LinkedIn, etc.). |
| `visible` | boolean | no | `false` hides the item. Defaults to visible if omitted. |

Anchor hrefs must match the section IDs above to scroll correctly.

### `socials`
```json
"socials": {
  "linkedin": "https://linkedin.com/in/your-handle",
  "github": "https://github.com/your-username",
  "resume": "/pranav_joshi_resume.pdf"
}
```
All three are used by header/sidebar/mobile nav icons. Keep them as valid URLs (or a
`/public` path for `resume`). **Replace placeholder values** like `YOUR_GITHUB`.

---

## `experience.json`

A JSON **array**. Each object is one job/role. Items are **auto-sorted by `endDate`
descending** at render time (current roles — `endDate: null` — sort to the top as
"Present"), so array order does not matter.

```json
{
  "title": "Software Engineer / AI & Automation Intern",
  "company": "Othership",
  "companyUrl": "https://www.othership.us",
  "companyLogo": "/company_logos/othership.jpg",
  "location": "Toronto, ON",
  "startDate": "May 2025",
  "endDate": "Aug 2025",
  "summary": "Built AI tools using RAG, GPT, TensorFlow...",
  "technologies": ["Python", "TensorFlow", "Google Cloud", "RAG", "GPT"]
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `title` | string | yes | Role title. Plain text. |
| `company` | string | yes | Company name. |
| `companyUrl` | string | no | If present, company name becomes a link with an external-link icon. Omit to render plain text. |
| `companyLogo` | string (path) | yes | Image under `/public` (e.g. `/company_logos/othership.jpg`). |
| `location` | string | yes | Only the part **before the first comma** is shown (e.g. `"Toronto, ON"` → `Toronto`). |
| `startDate` | string | yes | Free-form display string (`"May 2025"`, `"2024"`). |
| `endDate` | string \| null | yes | `null` renders as **"Present"** and sorts to top. Use a parseable date-ish string for correct sorting (`"Aug 2025"`, `"2024"`). |
| `summary` | string | yes | 1–3 sentences, plain text. |
| `technologies` | string[] | yes | Tag chips. **Only the first 5 are shown.** Use `[]` for none. |

**Sorting caveat:** `endDate` is parsed with JavaScript `new Date(...)`. Strings like
`"Aug 2025"` and `"2024"` parse fine. Avoid ambiguous formats; prefer `"Mon YYYY"` or `"YYYY"`.

---

## `academics.json`

A JSON **array**, one object per course/program. Also **auto-sorted by `endDate`
descending** (null = "Present", sorts to top).

```json
{
  "name": "Combinatorial Optimization",
  "institution": "University of Waterloo",
  "logo": "/logos/uw_logo.png",
  "url": "https://uwaterloo.ca/math",
  "startDate": "Jan 2026",
  "endDate": null,
  "description": "Integer programming, graph algorithms...",
  "topics": ["Integer Programming", "Graph Algorithms", "Network Flows"]
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | Course/program title. |
| `institution` | string | yes | School name. |
| `logo` | string (path) | yes | Image under `/public`. |
| `url` | string | no | If present, institution becomes a link with an external-link icon. |
| `startDate` | string | yes | Display string. |
| `endDate` | string \| null | yes | `null` → **"Present"** and sorts to top. |
| `description` | string | yes | 1–3 sentences, plain text. |
| `topics` | string[] | yes | Tag chips. **Only the first 5 are shown.** Use `[]` for none. |

---

## `projects.json`

A JSON **array**, one object per project. **Rendered in array order** (no auto-sort),
so order = display order. If the array is empty, the section shows
"No projects yet — check back soon."

```json
{
  "title": "AI Automation Pipeline",
  "description": "A RAG + GPT pipeline that processed 150K+ accounts...",
  "url": "https://github.com/your-username/project",
  "githubUrl": "https://github.com/your-username/project",
  "technologies": ["Python", "RAG", "GPT", "TensorFlow", "Google Cloud"]
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `title` | string | yes | Card heading. Also used as the React key (keep unique across projects). |
| `description` | string | yes | Plain text. **Visually clamped to 3 lines**, so front-load the key info. |
| `url` | string | no | Primary click target for the whole card. |
| `githubUrl` | string \| null | no | Adds a GitHub icon linking to the repo. `null` = no icon. |
| `technologies` | string[] | yes | Tag chips. **All are shown** (no cap here). Use `[]` for none. |

Card link behavior: clicking the card opens `url`, else `githubUrl`, else nothing.
For a real, clickable card, set at least one of `url` / `githubUrl` to a valid URL.
**Replace placeholder values** like `https://github.com/YOUR_GITHUB`.

---

## Agent checklist to make the site publish-ready

Use this as a task list when filling in content from the resume:

1. **`site.json`**
   - Real `name`, `role`, `description`.
   - Rewrite `intro[]` paragraphs; add `[phrase](color)` highlights (colors: yellow/blue/orange/green) on 2–4 key phrases per paragraph.
   - Fill `education[]` with real degree(s) + logo path.
   - Set real contact info in `contactBar2.text` (footer, links work). Update `banner.text` or set `banner.visible: false`.
   - Replace `socials.github` placeholder `YOUR_GITHUB` with the real profile; verify `linkedin` and `resume`.
   - Verify `navigation` hrefs; toggle `visible` per what should appear.
2. **`experience.json`** — one entry per role. Real `companyLogo` paths, `summary`, ≤5 `technologies`, correct `endDate` (`null` for current).
3. **`academics.json`** — one entry per course/program. Real `description`, ≤5 `topics`, correct dates.
4. **`projects.json`** — one entry per project, in intended display order. Real `url`/`githubUrl` (no `YOUR_GITHUB` placeholders), concise `description` (first 3 lines matter).
5. **Assets** — ensure every referenced path exists under `/public` (headshot, logos, company logos, `pranav_joshi_resume.pdf`).

### Validation before publishing
- Every file parses as valid JSON (no trailing commas/comments).
- No leftover placeholders: search for `YOUR_GITHUB`, `your@email.com`, `YOUR_`.
- All `/public` paths referenced actually exist.
- `intro` highlights use only yellow/blue/orange/green.
- Plain-text fields contain no stray markdown/highlight tokens.
