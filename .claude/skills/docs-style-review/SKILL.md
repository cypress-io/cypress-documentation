---
name: docs-style-review
description: Review a new or heavily rewritten docs page (.mdx under docs/) against the writing rules a linter can't check, such as leading with value, headings that stand alone, repeated explanations, and prose that belongs in a <CopyPrompt>. Edits the page to fix what it finds and reports each change with the rule behind it. Use when the page-review commit reminder lists a page, or when asked to review a page's writing style.
---

# Docs style review

Review one docs page for the judgment rules in the writing guides, fix what you
find in the page itself, and report every change with the rule behind it.

The rules live in [`AGENTS.md`](../../../AGENTS.md) and
[`AGENTS_REFERENCE.md#writing-style`](../../../AGENTS_REFERENCE.md#writing-style).
This skill doesn't restate them: read the linked section for each question
below before you judge it, so the guides stay the one source of truth. Where
this file and a guide disagree, the guide wins.

## 1. Clear the mechanical rules first

If `package.json` defines a `lint:prose` script, run `npm run lint:prose` on the
page and fix what it reports before the judgment pass. If it doesn't exist, say
so in the report and check the page against the hard rules in
[`.cursor/BUGBOT.md`, section 4](../../../.cursor/BUGBOT.md) by reading it, since
that is the same list Bugbot applies to the PR.

Fix those first so the judgment pass is about judgment, and list them in the
report under their own heading.

## 2. Read the page as a reader would

Read the whole page once, top to bottom, before changing anything. Several
questions below (repetition, the lead, `See also`) are about the page as a
whole and can't be answered section by section. Note what the page is: a guide,
an `/api` reference page (which keeps its fixed skeleton, see
[`docs/api/AGENTS.md`](../../../docs/api/AGENTS.md)), a changelog, or a
troubleshooting page.

## 3. Ask each question

For each one, read the linked rule, then look for every place the page breaks it.

1. **Does the page lead with the feature's value before configuration or
   steps?** [Lead with the value](../../../AGENTS_REFERENCE.md#lead-with-the-value).
   A reader who stops after the first paragraph should know why the feature
   exists. An admonition about versions or prerequisites in that spot pushes the
   value down.
2. **Does each heading make sense out of context, at roughly 40 to 60
   characters?** [Headings](../../../AGENTS_REFERENCE.md#headings). Check sentence
   case, an imperative verb for a task (and the same form across siblings), and
   whether the heading could sit on ten other pages. Before renaming a heading
   that exists at `HEAD`, weigh the anchor and section-file cost the rule
   describes and search the repo for its anchor.
3. **Is any explanation repeated in more than one place?** Look for the same
   behavior explained in the body, a table, troubleshooting, and limitations.
   Keep the fullest explanation where a reader looks for it first, cut the
   rest down to a sentence and a link to it.
4. **Are behaviors framed positively and reader-first?** The framing bullet in
   [`AGENTS.md` Writing style](../../../AGENTS.md#rules). Watch for caveats about
   the product's design and for "you will need to" chains that describe the
   burden instead of the step.
5. **Does it say what something does, not what it lets or allows the reader
   do?** [Person and tense](../../../AGENTS_REFERENCE.md#person-and-tense), along
   with present tense, active voice, "you" for the reader, a named subject in
   every sentence, and no Cypress version in body text (keep body text current).
6. **Are minimizing words and hedges gone?**
   [Word choice](../../../AGENTS_REFERENCE.md#word-choice). The rule is the
   minimizing sense, not the letters; the section lists the uses that are fine.
   "May", "can", and "it is recommended" often hedge a fact the page could state.
7. **Is the prose free of anything a reusable agent prompt should carry
   instead?** [`<CopyPrompt>` vs a code block](../../../AGENTS_REFERENCE.md#ai-prompts-copyprompt-vs-a-code-block).
   A recipe meant for `AGENTS.md`, `CLAUDE.md`, or a skill, shown in a code block
   or spelled out in prose, belongs in a `<CopyPrompt>` that follows the
   [authoring rules](../../../AGENTS_REFERENCE.md#copyprompt-authoring-rules).
8. **Is there any prose or a list inside a `<TabItem>`?**
   [Keep prose out of tabs](../../../AGENTS_REFERENCE.md#keep-prose-out-of-tabs).
   Variations that need their own prose or steps go in `<AccordionBlock>`s.
9. **Is a `## See also` section appropriate, and not padded?** The `See also`
   bullet in [`AGENTS.md`](../../../AGENTS.md#rules). Keep closely related pages,
   drop tangential ones and ones already prominent in the body, and add the
   section only when such pages exist.

Then read the rest of the `AGENTS.md` **Writing style** and **Authoring** rules
once more against the page, since the nine questions are the minimum, not the
whole list.

## 4. Edit the page

Fix each finding in the page. Keep to these limits:

- **Keep the facts.** Restructure and reword, but don't change what the page
  claims. If a fix needs a fact you can't confirm from the page, the source
  (see [API source of truth](../../../AGENTS_REFERENCE.md#api-source-of-truth)),
  or the author, flag it in the report instead of guessing.
- **Leave code examples as they are**, apart from moving them. Changing one
  brings it under the [code example rules](../../../AGENTS_REFERENCE.md#verifying-code-examples).
- **Update every link to an anchor you rename**, on this page and across the
  repo.

## 5. Verify

Run `npm run lint:fix`, then `npm run build`, which fails on a broken link or
anchor. Render the page in light and dark mode if you added or changed tabs,
accordions, or a `<CopyPrompt>`.

## 6. Report in the thread

Report every change, grouped by rule, each with a link to the rule:

```md
## Style review: `docs/app/ai/example.mdx`

**Mechanical (lint:prose not defined; checked against BUGBOT.md section 4)**

- Line 2: "Run cypress" → "Run Cypress" in `title` (product names)

**Headings** ([rule](AGENTS_REFERENCE.md#headings))

- `## Requirements` → `## Agent sandbox requirements for cypress tap`

**Repetition**

- Browser detection was explained in three places. Kept it in "Choose a
  browser", cut the others to one sentence and a link.

**Flagged, not changed**

- Line 120: the minimum memory figure needs a source.
```

End with the verification results (lint, build) and anything you chose not to
change and why.
