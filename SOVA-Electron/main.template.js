/**
 * Electron Main Process — Window Management & IPC
 *
 * Manages the S.O.V.A Electron desktop application lifecycle:
 *
 * Window Management:
 * - Splash screen → Console → War Room → Results (4-state flow)
 * - Dynamic window positioning for 3-pane popup layout
 * - Custom titlebar with traffic lights (frameless window)
 * - Display bounds calculation to prevent screen clipping
 *
 * IPC Channels:
 * - start-audit     → Launches attack pipeline (demo or live mode)
 * - audit-event     → Streams real-time events to renderer
 * - export-report   → Triggers PDF report generation
 *
 * Chromium Integration:
 * - Bundled Chromium for consistent cross-platform behavior
 * - Dynamic path resolution for packaged vs development mode
 * - Session-isolated browser profiles
 *
 * Complexity: ~380 lines · 4-state window management · IPC routing
 * Dynamic display bounds · Chromium bundling · Error recovery
 *
 * @proprietary Core implementation omitted from public repository.
 */

// [PROPRIETARY] — Electron main process, IPC handling,
// window management, and Chromium integration omitted.
