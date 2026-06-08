/**
 * Nova Attacker — Adaptive AI Attack Engine
 *
 * The core offensive engine for Live mode. Unlike Demo mode's scripted
 * narrative, Nova thinks adaptively — no predetermined script.
 *
 * Architecture:
 * - Spawns real Chromium browser instances
 * - Navigates to target autonomously
 * - Identifies attack surfaces in real-time
 * - Generates and evolves payloads using LLM
 * - Classifies outcomes and adapts strategy
 * - Streams events to Electron UI via IPC
 *
 * Key features:
 * - Multi-strategy chat input detection
 * - Active response settling (character-stability polling)
 * - Automated Google OAuth handling
 * - Prompt dismisser for Chromium dialogs
 * - 6-minute safety budget with graceful shutdown
 *
 * Complexity: ~1,070 lines · Real-time adaptive attacks
 * Browser automation · LLM-powered strategy · Auth handling
 *
 * @proprietary Core implementation omitted from public repository.
 */
