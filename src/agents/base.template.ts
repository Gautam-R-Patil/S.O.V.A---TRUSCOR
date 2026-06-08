/**
 * BaseAgent — Abstract Foundation for All S.O.V.A AI Agents
 *
 * Provides the common interface that all 6 specialized agents inherit:
 * - Standardized LLM interaction pattern
 * - Structured JSON response parsing with Zod validation
 * - Error handling and retry logic
 * - Token budget management
 *
 * All agents communicate exclusively through the LLMClient —
 * never directly with the browser or database.
 *
 * @proprietary Core implementation omitted from public repository.
 */

import type { LLMClient } from "../llm/client.js";

export abstract class BaseAgent {
    constructor(protected llm: LLMClient) {}

    /** @proprietary Abstract method — each agent implements its own logic. */
    abstract run(input: unknown): Promise<unknown>;
}
