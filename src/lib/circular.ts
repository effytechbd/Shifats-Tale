/**
 * Circular layout utility helpers
 */

/**
 * Calculates the shortest path difference between a card's index and the active index.
 * Returns values in the range [-N/2, N/2] where N is the total number of items.
 */
export const getCircularOffset = (index: number, activeIndex: number, total: number): number => {
  if (total <= 1) return 0;
  let diff = index - activeIndex;

  if (diff < -total / 2) {
    diff += total;
  } else if (diff > total / 2) {
    diff -= total;
  }

  return diff;
};
