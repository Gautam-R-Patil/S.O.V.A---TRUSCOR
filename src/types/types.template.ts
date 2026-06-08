/**
 * Type Definitions — Internal Architecture Contracts
 *
 * Core types that define the data flow across the S.O.V.A pipeline.
 * Includes: Attack, Session, Surface, TracingEvent
 *
 * @proprietary Full type definitions omitted from public repository.
 * See template files for interface signatures.
 */

// Attack types: id, surfaceId, class, payload, expectedBehavior, priority, parentId
// Session types: id, startedAt, status, config (targetUrl, credentials, stopPolicy, outputDir, llmRoleMap)
// Surface types: id, type, selector, contextLabel, url
// Tracing types: LlmTraceEntry, AtlasTraceEntry, AttackResultEntry

export {};
