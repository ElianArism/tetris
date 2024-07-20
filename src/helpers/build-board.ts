export function buildBoard(
  width: number,
  height: number
): number[][] {
  return Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));
}
