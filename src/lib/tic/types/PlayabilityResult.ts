export type PlayabilityResult = ({
  playable: false;
  reasons: string[];
} | {
  playable: true;
  marbles: string[]
});

export type CardPlayabilityMap = {
  [key: string]: PlayabilityResult;
};