export type PlayabilityResult = {
  playable: false;
  reasons: string[];
} | {
  playable: true;
};