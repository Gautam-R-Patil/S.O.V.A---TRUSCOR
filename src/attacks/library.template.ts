/**
 * Attack Library — Template Loader & Selector
 *
 * Loads attack payloads from 9 JSONL template families:
 *   context-poisoning   — Poison conversation context
 *   direct-injection    — Direct prompt injection attempts
 *   encoding-tricks     — Base64, ROT13, Unicode obfuscation
 *   exfiltration        — Data extraction patterns
 *   indirect-injection  — Indirect / second-order injections
 *   multimodal          — Image/audio steganography vectors
 *   persistence         — Memory/saved-info planting
 *   refusal-bypass      — Guardrail circumvention
 *   tool-abuse          — MCP/tool-use exploitation
 *
 * 100+ payloads across 9 categories. Each template is a JSONL entry
 * with: class, payload, expectedBehavior, severity, metadata.
 *
 * @proprietary Template content and selection logic omitted.
 */
export function loadAttackLibrary(): unknown[] { throw new Error("Proprietary"); }
