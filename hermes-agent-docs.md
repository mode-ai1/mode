# Hermes Agent — Research & Setup Notes for MØDE

*Research compiled 23 June 2026 from the official Hermes Agent documentation (`hermes-agent.nousresearch.com/docs`) and the Nous Research GitHub. Purpose: understand what's required to stand up **Hermes as MØDE** — the Socratic AI tutor and the autonomous-agent backbone of the platform.*

---

## 1. What Hermes Agent actually is

Hermes Agent is Nous Research's **self-improving, open-source AI agent** (MIT-licensed). It's not a model — it's an *agent runtime* that runs on top of an LLM you choose, and wraps that model with tools, memory, skills, automation, and messaging.

Its defining feature is a **built-in learning loop**: it creates skills from experience, improves them during use, persists knowledge across sessions, and builds a model of the user over time. For MØDE this is significant — it's exactly the "persistent cross-session memory + autonomous skill loop" the pitch attributes to the Orchestrator layer, and it's real, not aspirational.

**The models it runs on:** Hermes Agent can run on 30+ providers. The Hermes *models* themselves (Hermes 3 / Hermes 4, open-weight, fine-tuned on Llama 3.1 at 8B/70B/405B) are one option, but the agent is model-agnostic. Critically for MØDE, **NVIDIA Nemotron models are first-class** — both via Nous Portal and via NVIDIA NIM directly.

> **Key takeaway:** "Hermes as MØDE" is mostly a *configuration and authoring* exercise on top of the Hermes Agent runtime — choose a model (Nemotron), give it the MØDE identity (`SOUL.md`), author the curriculum as skills, wire up safety and payments, and expose it to the web app. You are not building an agent framework from scratch.

---

## 2. Installation & prerequisites

**Prerequisite:** Git (on Linux also `curl` + `xz-utils`; for the desktop app, `build-essential`/`g++`). The installer auto-installs everything else: **uv**, **Python 3.11**, **Node.js v22**, **ripgrep**, **ffmpeg**.

**Install paths:**

| Method | Command |
|---|---|
| Desktop app (macOS/Windows, recommended for non-devs) | Download installer from `hermes-agent.nousresearch.com` |
| CLI — Linux / macOS / WSL2 / Termux | `curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash` |
| CLI — Windows (native) | `iex (irm https://hermes-agent.nousresearch.com/install.ps1)` |
| pip / git / root (FHS) layouts | All supported; `hermes` auto-detects install method for updates |

After install: `source ~/.bashrc` then `hermes`.

**Data & config locations:**
- Code (git installer): `~/.hermes/hermes-agent/`
- Data directory: `~/.hermes/` (or `$HERMES_HOME`)
- **Secrets/tokens** → `~/.hermes/.env`
- **Non-secret settings** → `~/.hermes/config.yaml`
- Set values safely via CLI (routes to the right file automatically): `hermes config set <key> <value>`

**Minimum model context: 64,000 tokens.** Models below this are rejected at startup. Nemotron and all major hosted models clear this easily.

---

## 3. Setup modes

Running `hermes setup` offers three modes — the choice matters for a child-safety product:

| Mode | What it does | Fit for MØDE |
|---|---|---|
| **Quick Setup (Nous Portal)** | `hermes setup --portal` — free OAuth, no API keys; one subscription covers 300+ models + Tool Gateway (web search, image gen, TTS, cloud browser) | Fastest for prototyping the tutor |
| **Full Setup** | Walk through every provider/tool/option with your own keys | Good for the real, controlled deployment |
| **Blank Slate** | Everything **off** except provider+model, File Operations, and Terminal. No web, browser, code exec, memory, delegation, cron, skills, or MCP until you opt in | ✅ **Best baseline for a kids' product** — start locked down, enable only what's vetted |

> Blank Slate writes an explicit allowlist (`platform_toolsets.cli`) + `agent.disabled_toolsets`, so nothing you didn't choose ever loads — even after `hermes update`. For a COPPA/Children's-Code product, this "deny by default" posture is the right starting point.

---

## 4. Choosing the model — Nemotron for MØDE

The pitch names **NVIDIA Nemotron 3 Ultra** as the reasoning brain. Two supported routes:

1. **NVIDIA NIM (direct):** set `NVIDIA_API_KEY` (optionally `NVIDIA_BASE_URL`). Provider listed explicitly as *"Nemotron models via build.nvidia.com or local NIM."* This is the production-grade path and supports **local NIM** hosting — relevant if data-residency/privacy requires keeping inference in your own infra.
2. **Nous Portal:** select `nvidia/nemotron-3-ultra:free` (or a paid tier). Note: the **free Nemotron 3 Ultra promotion ran June 4–18, 2026 and has now ended** — verify current pricing/availability on Nous Portal before relying on the `:free` tier.

Switch models anytime: `hermes model` (picker) or `/model nvidia/nemotron-3-ultra` inside a session. No lock-in.

**Resilience features worth enabling for a live product:**
- **Fallback Providers** — automatic failover to a backup LLM on errors (independent fallback for vision/compression too).
- **Provider Routing** — sort/whitelist/blacklist providers by cost/speed/quality.
- **Credential Pools** — rotate across multiple keys on rate limits.
- **Prompt caching** — always-on 1-hour prefix cache (Claude on Anthropic/OpenRouter/Portal).

> Recommendation: Nemotron via NIM as primary, with a fallback provider configured. Keep a generic provider adapter mindset so a NIM outage during a demo doesn't take the tutor down.

---

## 5. The Socratic tutor identity — `SOUL.md` + personalities

This is the single most important mechanism for making Hermes *be* MØDE the tutor.

**`SOUL.md`** is the agent's **primary identity** — it occupies **slot #1 of the system prompt**, replacing the default "You are Hermes Agent…" identity. It lives at `~/.hermes/SOUL.md` (or `$HERMES_HOME/SOUL.md`), is loaded *only* from `HERMES_HOME` (never the working dir), is created automatically if missing, and is **never overwritten** once you've edited it. Content is injected verbatim after prompt-injection scanning + truncation.

What belongs in `SOUL.md`: durable voice, tone, directness, how to handle uncertainty/ambiguity — **identity, not task instructions**. This is where MØDE's Socratic doctrine lives: *never give the answer outright; escalate Question → Hint → Partial Example → Direct Explanation; keep language age-appropriate; encourage debugging over correcting.*

**Layered controls available:**
- **`/personality`** — session overlays. A built-in **`teacher`** personality ("patient educator with clear examples") ships out of the box and is an obvious starting point.
- **Custom personalities** in `config.yaml` under `agent.personalities` — e.g. define `mode-explorer` (ages 5–7), `mode-builder` (8–12), `mode-engineer` (13–15) as named overlays and switch per learner tier.
- **`AGENTS.md`** — project/task instructions (curriculum conventions, lesson structure) — kept *separate* from identity.

**System-prompt stack (top to bottom):** `SOUL.md` → tool guidance → memory/user context → skills guidance → context files (`AGENTS.md`) → timestamp → platform hints → `/personality` overlay.

> For MØDE: author a MØDE `SOUL.md` (the Socratic tutor persona) + per-tier custom personalities + an `AGENTS.md` describing lesson/assessment conventions. This trio defines the tutor's behavior without touching code.

---

## 6. Skills — how the MØDE curriculum becomes agent capability

Skills are **on-demand instruction documents** (`SKILL.md`: a name, description, and step-by-step procedure). They use **progressive disclosure** — the agent reads only the short descriptions for free and loads a skill's full body *only when a task matches*, so a large catalog doesn't bloat every request. They follow the open **agentskills.io** standard.

- Bundled skills live in `~/.hermes/skills/`; more come from the Skills Hub (`agentskills.io`).
- Manage: `hermes skills browse | search <kw> | install <source/path>` (install runs a security scan first). `hermes skills opt-in --sync` to seed.
- Every installed skill becomes a **slash command** automatically (`/skillname`), and the agent can auto-select the right skill mid-conversation.

> For MØDE: each curriculum module (Number Sense, Geometry, Patterns, Logic, Algebraic Thinking, Intro to Coding, Game Development, etc. — already outlined in `research/Learning Modules Outline.md`) maps naturally onto a **MØDE skill**. Authoring these as `SKILL.md` files is the bulk of turning the curriculum into something the tutor can actually teach and assess.

---

## 7. Memory — pedagogical state across sessions

Hermes has **bounded, curated persistent memory** via `MEMORY.md` and `USER.md` — it remembers preferences, projects, environment, and learned facts across sessions. There's also a pluggable **Memory Providers** system (Honcho, Mem0, Supermemory, OpenViking, Hindsight, etc.) for richer cross-session user modeling.

> Directly relevant to MØDE's privacy stance: the PRD/site commit to storing **pedagogical state** (mastery, ZPD position) rather than raw transcripts. Hermes' bounded `MEMORY.md` model fits this — store *what the child has mastered and where they are in the curriculum*, not chat logs. A memory provider could back the per-learner model at scale. **Memory design is a compliance decision, not just a feature.**

---

## 8. Tools, code execution & safety (the NemoClaw layer)

**Toolsets** are enable/disable-able per platform (`hermes tools`): web search, terminal, file editing, memory, delegation, vision, and more.

Most relevant to MØDE:

- **Code Execution** (`execute_code`) — the agent writes Python that calls Hermes tools via **sandboxed RPC**, collapsing multi-step workflows into one turn. (Note: this is the *agent's* code execution; the *child's* in-browser coding sandbox is a separate front-end concern — see `TECH_STACK_RECOMMENDATION.md`.)
- **Sandboxed terminal backends** — `hermes config set terminal.backend docker` (container isolation) or `ssh` (remote). **Essential** for running any untrusted execution safely.
- **Event Hooks** — run custom code at lifecycle points; **plugin hooks handle tool interception, metrics, and guardrails**. This is the natural insertion point for input/output moderation of tutor messages.
- **Checkpoints / `/rollback`** — auto-snapshots the working dir before file changes.
- **Subagent Delegation** (`delegate_task`) — spawns child agents with **isolated context and restricted toolsets** (3 concurrent by default). Could model per-tier specialist tutors or a "grader" subagent separate from the "tutor."

> **Mapping to the pitch's "Safety Cage / NemoClaw":** Hermes provides the *mechanism* (Blank Slate allowlists, Docker sandbox, hooks/guardrails, per-platform tool restriction, prompt-injection scanning of context files). NVIDIA NemoClaw / NeMo Guardrails would layer on top for declarative egress policy and content rails. MØDE still has to *author and test* the child-safety policies — the tooling doesn't make those decisions for you.

---

## 9. Connecting Hermes to the MØDE web app & users

Several integration surfaces matter for turning the CLI agent into a product:

- **API Server** — exposes Hermes as an **OpenAI-compatible HTTP endpoint**. Any frontend that speaks the OpenAI format (Open WebUI, LobeChat, LibreChat — *and your own Next.js app*) can talk to it. **This is the primary bridge between the MØDE front end and Hermes.**
- **Python library** — use Hermes programmatically (`docs/guides/python-library`); fits a FastAPI agent service.
- **MCP servers** — connect external tools (GitHub, databases, internal APIs, **Stripe**) via stdio/HTTP, with per-server tool filtering. The likely path for the **Stripe Agent Toolkit / payments**.
- **Messaging Gateway** — `hermes gateway setup` connects Telegram, Discord, Slack, WhatsApp, Signal, Email, Teams, Home Assistant. A candidate channel for **parent-facing** progress updates/notifications.
- **Cron / Scheduled Tasks** — natural-language or cron-expression scheduling; jobs can attach skills and deliver to any platform. Fits **automated progress reports and billing runs**.
- **ACP** (`hermes acp`) — editor integration (VS Code, Zed, JetBrains) for your own dev workflow.
- **Event Hooks (gateway)** — logging, alerts, webhooks for ops.

---

## 10. What "Hermes as MØDE" concretely requires

A consolidated checklist mapping MØDE's needs to Hermes mechanisms:

| MØDE need | Hermes mechanism | Setup action |
|---|---|---|
| Reasoning brain (Nemotron) | Provider: NVIDIA NIM | `NVIDIA_API_KEY` (or Portal); set fallback |
| Locked-down baseline (kids' safety) | Blank Slate setup mode | `hermes setup` → Blank Slate |
| Socratic tutor identity | `SOUL.md` (slot #1) | Author MØDE persona + escalation doctrine |
| Per-age-tier voice | Custom `/personality` presets | Define in `config.yaml` |
| Curriculum as capability | Skills (`SKILL.md`) | Author one skill per module/tier |
| Mastery/ZPD tracking, not transcripts | `MEMORY.md` / memory provider | Design pedagogical-state schema |
| Safe code/tool execution | Docker terminal backend + hooks | `terminal.backend docker`; guardrail hooks |
| Content moderation / egress policy | Hooks + NemoClaw/NeMo Guardrails | Author + test child-safety policies |
| Front-end ↔ agent | OpenAI-compatible API Server / Python lib | Stand up API server |
| Payments (earn/spend) | MCP server (Stripe) | Wire Stripe Agent Toolkit via MCP |
| Parent reports / billing automation | Cron + messaging gateway | Schedule jobs, connect a channel |
| Lesson/assessment conventions | `AGENTS.md` + context files | Author project context |

---

## 11. Open questions to resolve before committing

1. **Nemotron access & cost** — the free tier ended 18 June; confirm current Nous Portal pricing or budget for NIM/`build.nvidia.com` usage. Decide hosted vs **local NIM** (privacy/residency).
2. **Deployment topology** — Hermes runs as a CLI/daemon, not a browser SDK. MØDE needs a **server-side Hermes** (per-user sessions) behind the API server. How are concurrent learner sessions isolated and scaled?
3. **Per-child session/identity model** — Hermes memory and `SOUL.md` are per-instance/per-`HERMES_HOME`. How do you give each child a private memory/session without 1 process per child? (Likely `HERMES_HOME` per user, or a memory provider keyed by user.)
4. **NemoClaw integration specifics** — Hermes provides the hook/guardrail surface, but the exact NemoClaw wiring (egress policy, sandbox) needs its own spike against NVIDIA's docs.
5. **COPPA-grade data flow** — where memory is stored, what's retained, parental-consent gating *before* any agent session starts.
6. **The child's coding sandbox is separate** from Hermes' own `execute_code` — confirm the architecture keeps learner code execution in the front-end/Sandpack/Pyodide layer, not in the agent's terminal.

---

## Sources

- [Hermes Agent — Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Hermes Agent — Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Hermes Agent — Features Overview](https://hermes-agent.nousresearch.com/docs/user-guide/features/overview)
- [Hermes Agent — Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality)
- [Hermes Agent — Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Agent — Run Nemotron 3 Ultra free](https://hermes-agent.nousresearch.com/docs/guides/run-nemotron-3-ultra-free)
- [Hermes Agent docs home](https://hermes-agent.nousresearch.com/docs/)
- [NousResearch/hermes-agent (GitHub)](https://github.com/NousResearch/hermes-agent)
- [NousResearch/Hermes-Function-Calling (GitHub)](https://github.com/NousResearch/Hermes-Function-Calling)
- [Hermes 3 Technical Report (arXiv)](https://arxiv.org/pdf/2408.11857)
