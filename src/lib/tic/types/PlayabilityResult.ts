export type PlayabilityResult = ({
  playable: false;
  reasons: string[];
} | {
  playable: true;
});

export type CardPlayabilityMap = {
  [key: string]: PlayabilityResult;
};