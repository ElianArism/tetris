type Piece = number[][];

const I_Block: Piece = [[1, 1, 1, 1]];

const J_Block: Piece = [
  [0, 1],
  [0, 1],
  [1, 1],
];

const L_Block: Piece = [
  [1, 0],
  [1, 0],
  [1, 1],
];

const O_Block: Piece = [
  [1, 1],
  [1, 1],
];

const S_Block: Piece = [
  [1, 1, 0],
  [0, 1, 1],
];

const T_Block: Piece = [
  [0, 1, 0],
  [1, 1, 1],
];

const Z_Block: Piece = [
  [0, 1, 1],
  [1, 1, 0],
];

export const PIECES: Piece[] = [
  I_Block,
  J_Block,
  L_Block,
  O_Block,
  S_Block,
  T_Block,
  Z_Block,
];
