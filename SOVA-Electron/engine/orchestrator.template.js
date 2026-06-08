/**
 * Engine Orchestrator — Mode Router
 *
 * Routes audit requests to the appropriate execution engine:
 *   "demo" → mvp-runner.js (scripted 3-worker swarm)
 *   "live" → sova-bridge.js (real S.O.V.A CLI engine)
 *
 * @proprietary Mode routing logic omitted.
 */
