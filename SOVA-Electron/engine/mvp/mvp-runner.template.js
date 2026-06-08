/**
 * MVP Runner — Demo Mode Orchestrator
 *
 * Launches the scripted 3-worker swarm demonstration:
 *   1. Calculates screen geometry for 3-pane layout
 *   2. Launches α Alpha (Recon) → DuckDuckGo OSINT
 *   3. Launches β Beta (Explorer) → Gemini /saved-info persona planting
 *   4. Launches γ Gamma (Attacker) → 3-turn jailbreak sequence
 *   5. Coordinates worker handoffs (β signals → γ attacks)
 *   6. Fires scoring events as workers complete phases
 *   7. Closes all popups and emits final SRS score
 *
 * All 3 workers run REAL Chromium browsers doing REAL DOM interactions.
 * The scripted element is the chalk terminal narrative, not the browser.
 *
 * Complexity: ~330 lines · 3 parallel workers · Screen geometry
 * Worker coordination · Scoring timeline · Graceful cleanup
 *
 * @proprietary Orchestration and worker coordination logic omitted.
 */
