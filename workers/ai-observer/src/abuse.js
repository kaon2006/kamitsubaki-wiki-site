const MAX_MESSAGE_LENGTH = 5000;
const ANONYMOUS_TURNSTILE_THRESHOLD = 6;
const LOGGED_IN_TURNSTILE_THRESHOLD = 18;

export function assessChatRequest({ message = '', recentRequestCount = 0, isLoggedIn = false } = {}) {
  if (message.trim().length === 0) {
    return { allowed: false, requiresTurnstile: false, reason: 'empty_message' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { allowed: false, requiresTurnstile: false, reason: 'message_too_long' };
  }

  const threshold = isLoggedIn ? LOGGED_IN_TURNSTILE_THRESHOLD : ANONYMOUS_TURNSTILE_THRESHOLD;
  if (recentRequestCount >= threshold) {
    return {
      allowed: false,
      requiresTurnstile: true,
      reason: isLoggedIn ? 'user_rate_limit' : 'anonymous_rate_limit',
    };
  }

  return { allowed: true, requiresTurnstile: false, reason: 'normal' };
}
