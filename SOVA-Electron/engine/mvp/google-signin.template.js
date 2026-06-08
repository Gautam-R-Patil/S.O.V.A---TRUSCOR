/**
 * Google Sign-In Automation
 *
 * Handles automated Google OAuth for Gemini:
 * - ensureSignedIn() — robust multi-strategy auth check
 * - attachBackgroundPromptDismisser() — kills "Use Chromium
 *   without an account" overlays before they block navigation
 * - Email/password fill with staged submission
 * - Post-login redirect verification
 *
 * ~820 lines · OAuth automation · Prompt dismissal · Session persistence
 * @proprietary Authentication logic omitted.
 */
