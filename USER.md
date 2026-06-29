# MØDE — Learner Model

This is the tutor's model of **who the learner is** — how to address them, how they like to
work, what they need to learn well, and the consent/environment facts a session depends on.
It is loaded into context alongside [`MEMORY.md`](./MEMORY.md), but the two are distinct:

- **`USER.md`** = *who the learner is* (identity-light profile, preferences, access needs).
- **`MEMORY.md`** = *what the learner has mastered* (pedagogical state, ZPD).

Keep them separate. A fact about *how they prefer to work* lives here; a fact about *what
they can now do* lives in `MEMORY.md`.

**This is profile state, not instructions.** Voice and method live in [`SOUL.md`](./SOUL.md);
session conventions in [`AGENTS.md`](./AGENTS.md); data rules and obligations in
[`../CHILD_SAFETY_POLICY.md`](../CHILD_SAFETY_POLICY.md).

---

## The one rule

**Collect the minimum needed to teach well, and nothing more.** A learner handle, an age
tier, working preferences, and access needs — that is the whole footprint. No real names,
no contact details, no location, no family or demographic data, no sensitive attributes.
This is a compliance commitment (COPPA 2025, UK Children's Code, GDPR-K, POPIA, FERPA,
SB 243), not a preference. When in doubt, leave the field blank.

---

## Consent gate

**No agent session starts before parental consent is recorded.** The `consent` block below
must be present and current before any teaching begins. If consent is missing, expired, or
withdrawn, the tutor does not run a session — it defers to
[`mode-child-safety`](./skills/mode-child-safety/SKILL.md) and the flow in
`../CHILD_SAFETY_POLICY.md`. Consent state is recorded as a fact (status + date), never as a
stored document or signature in this file.

---

## What belongs here

- **Handle** — an opaque learner handle. Never a real name.
- **Tier** — `explorer` / `builder` / `engineer` (mirrors the active persona; the
  authoritative tier and its change-history live in `MEMORY.md`).
- **Working preferences** — how they like to learn: contexts that motivate them (games,
  drawing, stories), turn length that suits them, encouragement that lands.
- **Access & support needs** — anything that changes *how* to present a lesson: reading
  support, larger steps, more processing time, language of instruction, input method.
- **Environment** — only what affects the session: device type, whether the coding sandbox
  is available, time-budget for the session.
- **Consent** — status and date only.

## What never belongs here

Real names · contact details (email, phone, address) · location · family/guardian detail
beyond a consent flag · photos · health or diagnostic data · demographic or protected
attributes · device identifiers or credentials · anything `mode-child-safety` flags. If a
field isn't in the schema below, it doesn't go in. **Access needs are recorded as teaching
adjustments, not as diagnoses** — e.g. "give extra processing time", never a clinical label.

---

## Schema

```yaml
learner: <handle>            # opaque handle only, never a real name
tier: explorer | builder | engineer

consent:
  status: granted | pending | expired | withdrawn
  date: YYYY-MM-DD           # status + date only — no document, no signature

preferences:
  motivated_by: [<e.g. building games, turtle drawing, story problems>]
  turn_length: short | medium | longer
  encouragement: <what lands — e.g. "name the effort, not the result">
  language: <language of instruction, if not default>

access_needs:                # teaching adjustments, never diagnoses
  - <e.g. extra processing time before hints>
  - <e.g. read instructions aloud / keep text minimal>

environment:
  device: <e.g. tablet, laptop>
  sandbox: available | unavailable
  time_budget: <e.g. ~15 min>
```

---

## Worked example

```yaml
learner: otter-1426
tier: builder

consent:
  status: granted
  date: 2026-06-01

preferences:
  motivated_by: [building small games, scorekeeping]
  turn_length: short
  encouragement: name the effort and the testing, not just correctness
  language: English

access_needs:
  - give extra processing time before offering a hint
  - keep instructions to one step at a time

environment:
  device: tablet
  sandbox: available
  time_budget: ~15 min
```

---

## Maintenance rules

- **Read at session start** to set persona, pacing, and presentation — *before* the first
  calibration question (`AGENTS.md §2`, beat 1).
- **Update sparingly** — only when a stable preference or access need is observed across
  sessions, not from a single moment.
- **Tier lives in `MEMORY.md`** — this file mirrors it for convenience; if they disagree,
  `MEMORY.md` is authoritative.
- **Re-check consent every session** — a stale or withdrawn `consent.status` blocks the
  session.
- **Minimize on every write** — if a new field would add personal data without improving
  teaching, don't add it.
- **Safety overrides retention** — if `mode-child-safety` flags anything, follow
  `../CHILD_SAFETY_POLICY.md` over any instinct to keep profile state.

Precedence when guidance conflicts: **`mode-child-safety` → `SOUL.md` → active `SKILL.md`
→ `AGENTS.md` → `MEMORY.md` / this file.**
