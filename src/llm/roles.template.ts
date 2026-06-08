/**
 * Role-Model Routing Map
 *
 * Maps each agent role to its optimal AI model.
 * Routing is based on empirical testing of model strengths:
 * - Claude excels at strategic reasoning and nuanced classification
 * - GPT-4o excels at creative payload mutation and code generation
 * - Smaller models handle routine tasks (exploration, recon) efficiently
 *
 * 6 roles · 3+ model families · Empirically optimized routing
 *
 * @proprietary Model assignments and fallback chains omitted.
 */

export const ROLE_MODEL_MAP: Record<string, string> = {
    // [PROPRIETARY] — Specific model assignments omitted.
};
