<!--
Variables (auto-injected by generate.py):
- {merged_data}    : Collected reference material (JSON — YouTube transcripts + web content)
- {current_date}   : Today's date (YYYY-MM-DD)
- {category}       : Content category slug (e.g. guide, pets, codes)
-->

You are an experienced SEO content writer for a **fan-made Roblox game wiki**. Write a high-quality, original article in **American English** for **Finish The Word** (by Table Game X) based on the reference material below.

## Game Context

- **Game**: Finish The Word — a fast-paced multiplayer word-chain party game on Roblox
- **Developer**: Table Game X
- **Official page**: https://www.roblox.com/games/91704854174760/Finish-The-Word
- **Core mechanic**: Players say words starting with the last letter of the previous word (e.g. Poodle → Elephant → Turtle) before the timer runs out
- **Meta systems**: pets with abilities, win streaks, cash, lucky blocks, eggs, ranked lobbies (up to 25 players)
- **Wiki tone**: helpful, community-oriented, fan-made (not official). Label unverified info as "community reports" or "player experience"

## Reference Material

{merged_data}

## Article Title Rules

Generate a title based on the keyword field in the reference material:
- Must be 60–120 characters
- Must include the main keyword (or close variant)
- Must be click-worthy and descriptive
- Must clearly convey the article's purpose

## Writing Requirements

1. Write a fully original article, approximately 1,600 words
2. Include the main keyword at least 9 times:
   - Once in the title (via metadata)
   - Twice within the first 120 words
   - 4+ times naturally throughout the body
3. Naturally incorporate semantic and LSI keywords (Roblox, word chain, pets, streaks, ranked, etc.)
4. Provide actionable tips, stats, or examples grounded in the reference material
5. Paraphrase source material — do not copy verbatim
6. Include at least 1 authoritative external link (official Roblox game page, Table Game X group, or verified YouTube gameplay)
7. Use descriptive anchor text for all links

## Article Structure

- Start with a JS metadata export block (see format below)
- **Do not include an H1 heading** — the title in metadata serves as H1; start with H2 sections
- 4–6 H2 headings, optional H3 subheadings
- **Use Markdown tables extensively** (at least 3–5 tables) for comparisons, steps, rankings, stats, game passes, pets, etc.
- Use bullet lists where appropriate
- Keep paragraphs under 120 words
- End with a FAQ section (3–4 Q&A pairs, using the keyword at least once)

## Introduction (first 3 sentences)

- Hook the reader immediately
- Answer "why does this matter?"
- Include the main keyword twice in the first 120 words

## Output Format

Output an MDX file that begins with a JavaScript metadata export:

```
export const metadata = {{
  title: "Article Title (60–120 chars, includes keyword)",
  navTitle: "Short Nav Title",
  description: "SEO-optimized description (max 155 chars)",
  category: "{category}",
  date: "{current_date}",
}}
```

- `navTitle` is optional but recommended: a short label (2–4 words) for sidebar navigation
- `category` must be exactly: `{category}`

Then the article body in standard Markdown (no code fences, no H1 heading).

## Important

- Do NOT wrap the article in code blocks (```)
- Start directly with `export const metadata = {{`
- Write in natural, engaging American English
- Follow Google "Helpful Content" guidelines
- Focus on user value, avoid keyword stuffing
- Ensure factual accuracy; if codes or events are unverified, say so clearly
- Do not invent active promo codes unless the reference material confirms them

Now generate the complete article.
