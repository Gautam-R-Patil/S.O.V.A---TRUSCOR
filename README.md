<p align="center">
  <img src="SOVA-Electron/assets/logo.png" alt="S.O.V.A" width="120" />
</p>

<h1 align="center">S.O.V.A — Security & Offensive Vulnerability Adversary</h1>

<p align="center">
  <strong>The autonomous AI red-team engine powering TRUSCOR — the actuarial standard for agentic AI liability.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Playwright-Core-2EAD33?logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/SQLite-WAL_Mode-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Redis-Pub%2FSub-DC382D?logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Atlas_MCP-Custom-000000?logoColor=white" alt="Atlas MCP" />
  <img src="https://img.shields.io/badge/LLM-Agnostic-8B5CF6?logoColor=white" alt="LLM Agnostic" />
  <img src="https://img.shields.io/badge/Build-0_Errors-30D158" alt="Build" />
</p>

---

> ⚠️ **Proprietary Notice**: This is a public showcase repository. Core engine logic, attack payloads, LLM routing, and scoring algorithms are excluded. Template files (`.template.ts` / `.template.js`) document the architecture, function signatures, and complexity of each module without exposing implementation details. The full source is maintained in a private repository.

---

## What Is This?

**S.O.V.A** is a fully autonomous, multi-agent AI security engine that attacks AI systems the way a real adversary would — through the **visual interface layer** (DOM, browser UI, OS), not just the API.

It powers **TRUSCOR** — an institutional AI risk intelligence platform that produces a deterministic, FICO-style **Sybil Resilience Score (SRS)** for any AI deployment, translating vulnerabilities into insurance-grade financial metrics.

### Why It Matters

| Problem | What S.O.V.A Does |
|---|---|
| $400B deployed in enterprise AI, zero insurance-grade risk scoring | Produces a deterministic **SRS grade (0–850)** |
| APIs don't hallucinate refunds — **User Interfaces do** | Attacks the **visual layer** where financial liability is forged |
| Single-agent scanners miss multi-step attack chains | Deploys **swarms of coordinating AI agents** |
| Security reports don't speak insurance | Outputs **Probable Maximum Loss**, premium adjustments, compliance gaps |

---

## Architecture Overview

```
S.O.V.A
├── src/                          # CLI Engine (TypeScript)
│   ├── index.ts                  # CLI entry — Commander.js, ULID sessions
│   ├── controller.ts             # Brain — orchestrates 5-phase pipeline
│   ├── agents/                   # 7 AI Agents
│   │   ├── base.ts               # Abstract agent foundation
│   │   ├── explorer.ts           # DOM navigator (5-strategy click cascade)
│   │   ├── strategist.ts         # Attack planner (high-reasoning model)
│   │   ├── mutator.ts            # Payload evolution (high-speed model)
│   │   ├── recon.ts              # OSINT intelligence gatherer
│   │   ├── judge.ts              # Verdict classifier (4-class)
│   │   ├── attacker.ts           # Payload delivery coordinator
│   │   └── refiner.ts            # Memory builder (experience cases)
│   ├── phases/                   # 5-Phase Attack Pipeline
│   │   ├── phase1-recon.ts       # External intelligence (OSINT)
│   │   ├── phase2-mapping.ts     # Surface discovery (login + DOM crawl)
│   │   ├── phase3-planning.ts    # Attack strategy generation
│   │   ├── phase4-execution.ts   # Payload delivery (~480 lines)
│   │   └── phase5-report.ts      # SRS scoring + PDF generation
│   ├── llm/                      # LLM-Agnostic Model Gateway
│   │   ├── client.ts             # Multi-provider API, role-based routing
│   │   └── roles.ts              # Model assignments per agent role
│   ├── mcp/                      # Atlas MCP Browser Control
│   │   ├── client.ts             # JSON-RPC transport, MCP protocol
│   │   └── spawn.ts              # Session-isolated server spawner
│   ├── explore/                  # Visual-Layer Attack Engine
│   │   ├── visual-deliver.ts     # DOM payload delivery + active settling
│   │   ├── visual-loop.ts        # Autonomous exploration (~730 lines)
│   │   └── target-adapter.ts     # Per-domain navigation adapter
│   ├── attacks/                  # Attack Payload Library
│   │   ├── library.ts            # Template loader & selector
│   │   └── templates/            # 9 JSONL families, 100+ payloads
│   ├── memory/                   # SQLite Persistence
│   │   ├── db.ts                 # WAL-mode database
│   │   └── repos.ts              # 5 typed repositories
│   ├── login/handler.ts          # Multi-platform auth automation
│   ├── observe/snapshot.ts       # DOM state capture
│   ├── types/                    # TypeScript type contracts
│   └── util/                     # IDs, logging, retry logic
│
├── SOVA-Electron/                # Desktop Application (Electron)
│   ├── main.js                   # Window management, IPC, Chromium
│   ├── preload.js                # Secure context bridge
│   ├── renderer/                 # War Room UI (PUBLIC)
│   │   ├── index.html            # 14KB — 4-state UI shell
│   │   ├── css/sova.css          # 20KB — Glassmorphism dark theme
│   │   └── js/                   # Frontend modules
│   │       ├── app.js            # State machine & transitions
│   │       ├── chat.js           # SOVA assistant chat UI
│   │       ├── gauge.js          # Animated SRS gauge (Canvas)
│   │       ├── metrics.js        # Financial metrics grid
│   │       ├── reports.js        # PDF report generation
│   │       └── terminal.js       # Real-time attack terminal
│   ├── engine/                   # Attack Engine
│   │   ├── orchestrator.js       # Mode router (demo vs live)
│   │   ├── nova-attacker.js      # Adaptive AI attacker (~1,070 lines)
│   │   ├── browser-attacker.js   # Playwright attack executor (~960 lines)
│   │   ├── scoring.js            # SRS calculator
│   │   ├── mvp/                  # Demo Mode — 3-Worker Swarm
│   │   │   ├── mvp-runner.js     # Swarm orchestrator
│   │   │   ├── worker-alpha.js   # α Recon worker
│   │   │   ├── worker-beta.js    # β Explorer worker
│   │   │   ├── worker-gamma.js   # γ Attack worker
│   │   │   ├── google-signin.js  # OAuth automation (~820 lines)
│   │   │   └── chromium-popup.js # Popup manager (~400 lines)
│   │   └── live/                 # Live Mode — CLI Bridge
│   │       ├── sova-bridge.js    # CLI-to-Electron connector
│   │       ├── log-parser.js     # Stderr → terminal router
│   │       ├── jsonl-tailer.js   # Real-time trace monitor
│   │       └── score-mapping.js  # Verdict → penalty mapper
│   └── scripts/                  # Build & deployment
│
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

---

## The 5-Phase Attack Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Phase 1  │───▶│ Phase 2  │───▶│ Phase 3  │───▶│ Phase 4  │───▶│ Phase 5  │
│  RECON   │    │ MAPPING  │    │ PLANNING │    │EXECUTION │    │  REPORT  │
│          │    │          │    │          │    │          │    │          │
│ External │    │ Login +  │    │ AI-Gen   │    │ Payload  │    │ SRS 850  │
│ OSINT    │    │ DOM Crawl│    │ Strategy │    │ Delivery │    │ Scoring  │
│ Dossier  │    │ Surfaces │    │ Attack   │    │ Mutation  │    │ PDF Gen  │
│          │    │          │    │ Plan     │    │ Judging  │    │ PML Calc │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
      ↕               ↕               ↕              ↕               ↕
  ReconAgent     ExplorerAgent   StrategistAgent  Mutator+Judge   RefinerAgent
```

Each phase feeds its output to the next. The pipeline runs autonomously — no human intervention required.

---

## Multi-Agent Swarm Architecture

S.O.V.A doesn't use a single agent. It deploys **swarms of specialized AI agents** that think independently and communicate in real-time.

### Small Scale (3 Agents — Current MVP)

| Agent | Role | Description |
|---|---|---|
| **α Alpha** | Recon | External intelligence gathering, surface scanning |
| **β Beta** | Explorer | Infiltration, persistence planting, auth bypass |
| **γ Gamma** | Attacker | Payload delivery, jailbreak sequences, exploitation |

### The Endgame — Scalable Swarms (N Agents)

The architecture is designed for horizontal scaling. Each role (α/β/γ) replicates into N instances communicating via a **Swarm Consensus Bus**:

```
    α₁ ──┐              ┌── γ₁
    α₂ ──┤              ├── γ₂
    α₃ ──┼── SWARM BUS ──┼── γ₃
    ...  ──┤              ├── ...
    αₙ ──┘              └── γₙ
              ↕
         β₁ β₂ β₃ ... βₙ
```

- **Think independently** — each agent runs its own LLM reasoning
- **Communicate real-time** — share discovered surfaces, coordinate timing
- **Divide & conquer** — parallel attack coverage, collective adaptation
- **No scripts** — fully adaptive, thinks on the spot every time

---

## Two Operational Modes

### Demo Mode — Scripted 3-Worker Swarm
Launches **3 real Chromium browser popups** simultaneously, each performing real DOM interactions on the target. The attack narrative is scripted for demo consistency.

### Live Mode — Adaptive AI Attacker
Spawns the **full S.O.V.A CLI engine** with zero scripts. The AI thinks on the spot, plans attacks adaptively, and executes without predetermined outcomes.

---

## The SRS — Sybil Resilience Score

A deterministic, FICO-style grade that translates adversarial findings into a single insurable number.

| Range | Grade | Risk Level |
|---|---|---|
| 750–850 | 🟢 A | Low Risk — insurable at standard rates |
| 500–749 | 🟡 B | Medium Risk — elevated premiums |
| 250–499 | 🟠 C/D | High Risk — remediation required |
| 0–249 | 🔴 F | Critical — uninsurable |

**6 penalty categories**: AUTH · DB · PII · LOGIC · RCE · DOS

---

## Engineering Highlights

| Innovation | Description |
|---|---|
| **Visual-Layer Attacks** | Attacks the DOM and browser UI, not just the API |
| **Active Response Settling** | Polls character-length stability instead of `sleep()` |
| **5-Strategy Click Cascade** | Locator → Force → JS → Keyboard → CDP fallback |
| **Mutation Queue Safeguards** | Per-root-parent caps prevent infinite mutation loops |
| **Session Isolation** | Per-session Playwright profiles with zero cache contamination |
| **Role-Based LLM Routing** | High-reasoning for strategy, high-speed for mutations, lightweight for recon |
| **Cross-Session Memory** | LogRefinerAgent distills sessions into reusable Experience Cases |
| **Dynamic Auth Detection** | Hostname-based redirect checking catches session expiry mid-attack |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript 5.x (CLI), JavaScript (Electron) |
| **Runtime** | Node.js 20+ |
| **Browser Automation** | Playwright-core via Atlas MCP Server (custom-built) |
| **AI Models** | LLM-agnostic — any foundation model hot-swappable per role |
| **Protocol** | MCP (Model Context Protocol) over JSON-RPC stdio |
| **Database** | SQLite with better-sqlite3 (WAL mode) |
| **Pub/Sub** | Redis for swarm coordination |
| **Validation** | Zod schema validation for all LLM outputs |

---

## Metrics

| Metric | Value |
|---|---|
| Total source files | ~55 (30 TS + 25 JS) |
| AI agents | 7 specialized |
| Attack phases | 5 sequential |
| Attack template categories | 9 JSONL families |
| Attack payloads | 100+ |
| LLM models | Any provider, role-routed (agnostic) |
| TypeScript build | **0 errors** |
| Largest single file | `nova-attacker.js` — 1,070 lines |
| Largest TS file | `visual-loop.ts` — 730 lines |

---

## About TRUSCOR

S.O.V.A is the offensive engine powering **[TRUSCOR](https://truscor.org)** — the institutional AI risk intelligence platform.

TRUSCOR produces the **SRS (Sybil Resilience Score)** — a deterministic, FICO-style grade for AI systems. The score translates adversarial test results into insurance-grade financial metrics: Probable Maximum Loss (PML), premium adjustments, compliance gaps, and remediation priorities.

> *"There is no such metric. This would really help us get funding and contracts. We will pay for the product."*
> — **CEO, Yuga AI** (unsolicited, on record)

---

## Template File System

All proprietary source files are replaced with `.template` versions that document:
- ✅ Function signatures and class structures
- ✅ Architecture comments explaining what each module does
- ✅ Complexity metrics (line counts, function counts)
- ✅ Dependencies and data flow descriptions
- ❌ No actual implementation logic

Example: `src/phases/phase4-execution.template.ts` documents the 480-line execution engine's 14 internal functions and 3-agent coordination pattern without revealing the code.

---

## Contact

**Gautam Patil** — Founding CEO & CTO
gautam@truscor.org · [truscor.org](https://truscor.org)

---

<p align="center">
  <em>S.O.V.A — The engine that grades AI. The rating agency, the oracle, and the Safe Harbor.</em>
</p>
