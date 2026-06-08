/**
 * SOVA Bridge — Live Mode CLI-to-Electron Connector
 *
 * Spawns the full S.O.V.A CLI engine as a child process and bridges
 * its output to the Electron War Room UI.
 *
 * Bridge architecture:
 * - Spawns `node dist/index.js <target>` with isolated env
 * - Parses stderr lines → routes to α/β/γ terminal panes
 * - Tails JSONL trace files (LLM traces, Atlas traces)
 * - Maps real attack results to financial penalties
 * - 6-minute hard kill budget for safety
 *
 * ~260 lines · Child process management · Stderr parsing
 * JSONL tailing · Real-time event routing · Safety budget
 *
 * @proprietary Bridge implementation omitted.
 */
