import { GAME_CONFIG, PIECES } from "./constants";
import { buildBoard } from "./helpers";
import "./style.css";

// Setup game container
const gameContainer: HTMLCanvasElement = <HTMLCanvasElement>(
  document.querySelector("#game-container")
);
const scoreElementRef: HTMLElement = <HTMLElement>(
  document.querySelector("#score")
);
const gameContainerCtx: CanvasRenderingContext2D = <
  CanvasRenderingContext2D
>gameContainer.getContext("2d");

const {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GAME_CONTAINER_HEIGHT,
  GAME_CONTAINER_WIDTH,
  BLOCK_SIZE,
} = GAME_CONFIG;

gameContainer.height = GAME_CONTAINER_HEIGHT;
gameContainer.width = GAME_CONTAINER_WIDTH;

gameContainerCtx.scale(BLOCK_SIZE, BLOCK_SIZE);

// Board
let board = buildBoard(BOARD_WIDTH, BOARD_HEIGHT);

// Score
let score: number = 0;
scoreElementRef.innerHTML = score + "";
// Pieces
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// Piece Movement
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      piece.position.x--;
      if (checkCollision()) piece.position.x++;
      break;
    case "ArrowRight":
      piece.position.x++;
      if (checkCollision()) piece.position.x--;
      break;
    case "ArrowDown":
      piece.position.y++;
      if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        removeRows();
      }
      break;
    case "ArrowUp":
      console.log("event");
      const rotated: number[][] = [];

      for (let i = 0; i < piece.shape[0].length; i++) {
        const row: number[] = [];
        for (let j = piece.shape.length - 1; j >= 0; j--) {
          row.push(piece.shape[j][i]);
        }
        rotated.push(row);
      }

      const previousShape = piece.shape;
      piece.shape = rotated;
      if (checkCollision()) {
        piece.shape = previousShape;
      }

      break;
    default:
      break;
  }
});

// siempre que se hace un juego se utiliza una función denominada gameLoop / En este caso se conforma por update y draw

// auto drop - gameLoop
let dropCounter: number = 0,
  lastTime: number = 0;

function update(time: number = 0) {
  const deltaTime: number = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  gameContainerCtx.fillStyle = "#000";
  gameContainerCtx.fillRect(
    0,
    0,
    gameContainer.width,
    gameContainer.height
  );

  board.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel === 1) {
        gameContainerCtx.fillStyle = "yellow";
        gameContainerCtx.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel === 1) {
        gameContainerCtx.fillStyle = "red";
        gameContainerCtx.fillRect(
          x + piece.position.x,
          y + piece.position.y,
          1,
          1
        );
      }
    });
  });
}

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((pixel, x) => {
      return (
        pixel !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
}

function solidifyPiece() {
  piece.shape.find((row, y) => {
    return row.find((pixel, x) => {
      if (pixel === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  // Reset position
  piece.position.x = Math.floor((Math.random() * BOARD_WIDTH) / 2);
  piece.position.y = 0;

  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

  // game over
  if (checkCollision()) {
    alert("Game over\n Your score is " + score);
    board = buildBoard(BOARD_WIDTH, BOARD_HEIGHT);
    score = 0;
  }
}

function removeRows() {
  const rowsToRemove: number[] = [];

  board.forEach((row, y) => {
    if (!row.includes(0)) rowsToRemove.push(y);
  });

  rowsToRemove.forEach((rowToRemove) => {
    board.splice(rowToRemove, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
    scoreElementRef.innerHTML = score + "";
  });
}

update();
