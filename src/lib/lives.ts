export const MAX_LIVES = 5;
export const REFILL_MINUTES = 20;

/**
 * Recalculates the number of lives a user has based on the time elapsed
 * since the last life was regenerated.
 *
 * @param user An object containing user's life data. Must have `lives` and `lastLifeUpdate`.
 * @param now The current date, for testability. Defaults to `new Date()`.
 * @returns An object with the recalculated `lives` and `lastLifeUpdate`.
 */
export function recalculateLives<T extends { lives?: number; lastLifeUpdate?: any }>(
  user: T,
  now = new Date()
): T & { lives: number; lastLifeUpdate: Date } {
  const firestoreTimestampToDate = (timestamp: any): Date => {
    if (!timestamp) return now;
    // Handle Firestore Timestamp object
    if (timestamp.toDate) return timestamp.toDate();
    // Handle ISO string or JS Date object
    return new Date(timestamp);
  }

  let lives = user.lives ?? MAX_LIVES;
  let lastLifeUpdate = firestoreTimestampToDate(user.lastLifeUpdate);

  if (lives >= MAX_LIVES) {
    return { ...user, lives: MAX_LIVES, lastLifeUpdate: now };
  }

  const diffMs = now.getTime() - lastLifeUpdate.getTime();
  const livesToAdd = Math.floor(diffMs / (REFILL_MINUTES * 60 * 1000));

  if (livesToAdd > 0) {
    const newLives = Math.min(MAX_LIVES, lives + livesToAdd);
     // Calculate the exact time the last life was earned to prevent accumulating "debt"
    const newLastLifeUpdate = new Date(
      lastLifeUpdate.getTime() + (newLives - lives) * REFILL_MINUTES * 60 * 1000
    );
    
    lives = newLives;
    // The last update time should not be in the future
    lastLifeUpdate = newLastLifeUpdate > now ? now : newLastLifeUpdate;
  }

  return { ...user, lives, lastLifeUpdate };
}
