# MØDE Skills

This folder holds the MØDE tutor's **skills** — on-demand instruction documents (`SKILL.md`) that turn the MØDE curriculum into capability the agent can teach. Each skill has a short `description` (read for free) and a full body loaded only when a task matches (progressive disclosure, per the [agentskills.io](https://agentskills.io) standard).

These skills sit *under* the tutor's identity in **`../SOUL.md`** — the Socratic, never-give-the-answer persona. A skill tells the tutor *how to run a lesson*; it never overrides the soul.

## The set

### Always on
| Skill | What it does |
|---|---|
| **`mode-child-safety`** | **Always loaded; overrides every other skill.** Content rails, privacy/data minimization, crisis & disclosure handling, refusal patterns, healthy-use and honesty. Paired with the operational/compliance doc **`../../CHILD_SAFETY_POLICY.md`**. |

### First contact
| Skill | Ages | What it teaches |
|---|---|---|
| **`mode-onboarding`** | all | A new learner's first session: warm welcome, calibration through play, one real first win, hand-off to a module. |

### Curriculum modules
| Skill | Ages | Focus |
|---|---|---|
| **`mode-number-sense`** | 5–12 | Numbers, place value, the four operations, word problems. |
| **`mode-patterns-sequences`** | 6–13 | Repeating/growing patterns, number sequences, finding the rule. |
| **`mode-shapes-geometry`** | 6–15 | 2D/3D shapes, perimeter/area/volume, angles, symmetry, drawing with code. |
| **`mode-logic-reasoning`** | 7–15 | True/false, AND/OR/NOT, conditionals, deduction vs induction. |
| **`mode-data-measurement`** | 7–15 | Collecting/organizing data, charts, mean/median/mode/range, units & estimation. |
| **`mode-algebraic-thinking`** | 9–15 | Variables, expressions vs equations, solving by balance, functions, linear relationships. |
| **`mode-creative-problem-solving`** | 7–15 | Divergent/convergent thinking, decomposition, resilience, the iterate loop. (Meta-skill.) |
| **`mode-intro-coding`** | 8–15 | Algorithms, sequencing, variables, conditionals, loops, functions, and debugging. |
| **`mode-game-development`** | 9–15 | Game design, the game loop, state & rules, collisions, playtesting. (Capstone.) |

## How they fit together

- **`SOUL.md`** = identity (voice, Socratic escalation: Question → Hint → Partial Example → Direct Explanation).
- **`mode-child-safety`** = always-on conduct; safety beats every lesson goal, every time.
- **Curriculum skills** = how to teach one module. Each one: calibrate → guide (never tell) → predict-before-run → assess by transfer → hand off. Every skill ends by deferring to `mode-child-safety` for any safety/privacy/wellbeing concern.

### Rough learning path
```
mode-onboarding
   ├─ mode-number-sense ─▶ mode-patterns-sequences ─▶ mode-algebraic-thinking
   ├─ mode-shapes-geometry ─▶ mode-data-measurement
   ├─ mode-logic-reasoning ─▶ mode-intro-coding ─▶ mode-game-development
   └─ mode-creative-problem-solving  (woven through all of the above)
```
Paths are guides, not rails — the tutor routes a learner by demonstrated mastery, not age alone.

## Authoring conventions (for new module skills)

Every curriculum `SKILL.md` follows the same shape, so the tutor's behaviour stays consistent:

1. **Frontmatter:** `name`, a trigger-rich `description` (what + ages + when to use), and `license`.
2. **Intro** + an explicit *"does not override identity"* note pointing at `SOUL.md`.
3. **Learning objectives** (3–4).
4. **Before you start — calibrate** (age-tiered).
5. **The big idea to protect** (the conceptual prize, not the procedure).
6. **How to run a lesson** (predict-before-run, learner writes the code, errors are the lesson).
7. **Worked teaching patterns** (Socratic paths, minimal hints only).
8. **Suggested mini-challenges** (offer choices; coach, never solve).
9. **Assessment & progress** — *pedagogical state, not transcripts.*
10. **Guardrails specific to this skill.**
11. **When to hand off** (cross-linked to sibling skills + `mode-child-safety`).

When adding a module, copy an existing skill's structure and keep the cross-references current.

## Safety pairing

The behavioural skill **`mode-child-safety/SKILL.md`** and the operational policy **`../../CHILD_SAFETY_POLICY.md`** are two halves of one commitment. The skill is what the tutor *does*; the policy is the moderation pipeline, regulatory obligations (COPPA 2025, UK Children's Code, GDPR-K, POPIA, FERPA, SB 243), data rules, logging, and escalation behind it. Ship neither without the other.
