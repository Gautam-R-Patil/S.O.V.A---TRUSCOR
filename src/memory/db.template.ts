/**
 * SQLite Database — Session Persistence & Experience Memory
 *
 * Uses better-sqlite3 in WAL mode for concurrent read/write.
 * Schema: sessions, surfaces, attacks, results, experience_cases
 *
 * WAL mode enables safe reads during active attack sessions.
 *
 * @proprietary Schema and initialization logic omitted.
 */
export function openDb(): unknown { throw new Error("Proprietary"); }
