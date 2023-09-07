export type TicCard =
  {
    id: number;
  } &
  ({
    type: 'number' | 'split' | 'enter' | 'backwards' | 'skip',
    value: number;
  } | {
    type: 'first_aid' | 'mindcontrol' | 'dash_attack' | 'rotate' | 'swap' | 'undo';
    value?: undefined;
  });