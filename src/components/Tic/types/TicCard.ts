export type TicCard = {
  type: 'number' | 'split' | 'enter' | 'backwards' | 'skip',
  value: number;
} | {
  type: 'first_aid' | 'mindcontrol' | 'dash_attack' | 'rotate' | 'swap' | 'undo';
};