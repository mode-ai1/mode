# MØDE — Persistent Memory

This is the tutor's **bounded, curated** cross-session memory. It holds **pedagogical
state** — what a learner has mastered and where they are in the curriculum — and nothing
else. It is loaded into context at the start of each session so the tutor can resume
without re-calibrating from scratch.

**This is identity-neutral state, not instructions.** Voice and method live in
[`SOUL.md`](./SOUL.md); session conventions live in [`AGENTS.md`](./AGENTS.md); the rules
and obligations behind this file live in
[`../CHILD_SAFETY_POLICY.md`](../CHILD_SAFETY_POLICY.md).

---

## The one rule

**Store what the learner has mastered and where they are — never how the conversation
went.** No verbatim chat. No transcripts. No personal detail beyond the schema below. This
is a compliance commitment (COPPA 2025, UK Children's Code, GDPR-K, POPIA, FERPA, SB 243),
not a preference. When in doubt, store less.

---

## What belongs here

- **Tier & calibration** — current persona (`explorer` / `builder` / `engineer`) and any
  adjustment, with the date it last changed.
- **Mastery ledger** — per objective: status, and the *transfer task* that proved it.
- **ZPD position** — per active module, the single next reachable step.
- **Open misconceptions** — surfaced but not yet resolved, so the next session can target
  them.
- **Routing state** — modules completed, in progress, and the agreed next destination.
- **Lightweight preferences** — only what improves teaching (e.g. "likes turtle drawing",
  "prefers building games to puzzles"). Never sensitive attributes.

## What never belongs here

Conversation logs · exact wording of anything a learner said · personal identifiers beyond
a learner handle · location, contacts, family detail · health, demographic, or protected
attributes · anything `mode-child-safety` flags · credentials or device data. If a field
isn't in the schema below, it doesn't go in.

---

## Schema

One record per learner. Keep it short — this is a curated summary, not a history.

```yaml
learner: <handle>          # opaque handle only, never a real name
tier: explorer | builder | engineer
tier_changed: YYYY-MM-DD   # when the current tier was last set
last_session: YYYY-MM-DD

mastery:                   # demonstrated by transfer, not repetition
  - objective: <one concrete, testable objective>
    module: <skill name, e.g. mode-number-sense>
    status: mastered | developing | introduced
    proof: <the changed problem they solved unaided>   # required for "mastered"
    date: YYYY-MM-DD

zpd:                       # the next reachable step, per active module
  - module: <skill name>
    next_step: <the single next thing within reach>

misconceptions:           # surfaced, not yet resolved
  - note: <what they consistently get wrong>
    module: <skill name>
    status: open | resolved

routing:
  completed: [<skill names>]
  in_progress: [<skill names>]
  next: <agreed next destination>

preferences:              # only what improves teaching
  - <short, non-sensitive note>
```

### Status definitions

- **introduced** — has seen the idea; cannot yet apply it.
- **developing** — applies it with hints or on familiar problems only.
- **mastered** — applies it unaided to a *changed* problem. Requires a `proof` entry. This
  is the only status that gates routing forward.

---

## Worked example

```yaml
learner: otter-1426
tier: builder
tier_changed: 2026-06-10
last_session: 2026-06-23

mastery:
  - objective: Use a variable to remember and update a running total
    module: mode-intro-coding
    status: mastered
    proof: Rewrote a score counter to add 5 per coin instead of 1, predicted output correctly
    date: 2026-06-23
  - objective: Read a loop's behaviour on its first iteration
    module: mode-intro-coding
    status: developing
    date: 2026-06-23

zpd:
  - module: mode-intro-coding
    next_step: Predict a loop's value after two iterations before running it
  - module: mode-number-sense
    next_step: Word problems with two operations

misconceptions:
  - note: Expects a loop to run once even when the condition is false at the start
    module: mode-intro-coding
    status: open

routing:
  completed: [mode-onboarding, mode-number-sense]
  in_progress: [mode-intro-coding]
  next: mode-patterns-sequences (after loop confidence is solid)

preferences:
  - Motivated by building small games; lukewarm on pure number drills
```

---

## Maintenance rules

- **Update at session end** (`AGENTS.md §2`, beat 5) — append new mastery with its proof,
  advance ZPD, close or open misconceptions, set `next`.
- **Promote to `mastered` only on transfer** — a repeated problem never qualifies.
- **Keep it bounded** — when a module is fully complete, collapse its objectives to a
  single summary line rather than retaining every step.
- **Resume, don't restart** — a returning learner picks up from `zpd`; never re-teach a
  `mastered` objective.
- **Safety overrides retention** — if `mode-child-safety` flags anything, follow the policy
  in `../CHILD_SAFETY_POLICY.md` over any instinct to keep state.

Precedence when guidance conflicts: **`mode-child-safety` → `SOUL.md` → active `SKILL.md`
→ `AGENTS.md` → this file.**
