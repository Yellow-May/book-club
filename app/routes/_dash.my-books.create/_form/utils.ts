export const MAX_WORDS = 500;

export function calculateWords(value: string) {
  return value.split(" ").filter((e) => e).length;
}
