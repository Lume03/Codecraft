export const MAX_LIVES = 5;
export const REFILL_MINUTES = 2; // Reducido a 2 minutos para facilitar las pruebas

/**
 * Recalculates the number of lives a user has based on the time elapsed
 * since the last life was regenerated. It correctly handles different timestamp formats
 * and is resilient to missing or undefined input data.
 *
 * @param user An object containing user's life data. Must have `lives` and `lastLifeUpdate`.
 * @param now The current date, for testability. Defaults to `new Date()`.
 * @returns An object with the recalculated `lives` and `lastLifeUpdate`.
 */
export function recalculateLives<T extends { lives?: number; lastLifeUpdate?: any }>(
  user: T,
  now = new Date()
): { lives: number; lastLifeUpdate: Date } {
    
  const firestoreTimestampToDate = (timestamp: any): Date => {
    if (!timestamp) return now;
    // Handle Firestore Timestamp object from server-side (admin SDK)
    if (timestamp.toDate) return timestamp.toDate();
    // Handle ISO string or JS Date object from client-side
    return new Date(timestamp);
  }

  // CRITICAL FIX: Ensure 'lives' is a number, defaulting to MAX_LIVES if undefined or null.
  // This prevents any subsequent calculation from resulting in NaN.
  let lives = user.lives ?? MAX_LIVES;
  let lastLifeUpdate = firestoreTimestampToDate(user.lastLifeUpdate);

  // If lives are full, the timer is effectively paused. The last update time is now.
  if (lives >= MAX_LIVES) {
    return { ...user, lives: MAX_LIVES, lastLifeUpdate: now };
  }

  const diffMs = now.getTime() - lastLifeUpdate.getTime();
  const livesToAdd = Math.floor(diffMs / (REFILL_MINUTES * 60 * 1000));

  if (livesToAdd > 0) {
    // Math.min is safe here because 'lives' is guaranteed to be a number.
    const newLives = Math.min(MAX_LIVES, lives + livesToAdd);
    // Important: The new reference date is advanced only by the time it took to earn the new lives.
    // This preserves any "progress" towards the next life.
    const newLastLifeUpdate = new Date(
      lastLifeUpdate.getTime() + livesToAdd * REFILL_MINUTES * 60 * 1000
    );
    
    lives = newLives;
    lastLifeUpdate = newLastLifeUpdate;
  }

  return { ...user, lives, lastLifeUpdate };
}
