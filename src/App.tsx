import { batch, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import GameOver from "./components/GameOver";

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const WORDS = [
  "REACT",
  "SOLID",
  "HELLO",
  "WORLD",
  "SWIFT",
  "GAMES",
  "PLANT",
  "HOUSE",
  "HAPPY",
  "LIGHT",
];
const LOCAL_STORAGE_KEY = "wordleGameState";

export type CellState = "" | "correct" | "present" | "absent";
export type BoardState = Array<Array<{ letter: string; state: CellState }>>;

export type GameState = {
  board: BoardState;
  keyboard: Record<string, CellState>;
  targetWord: string;
  currentRow: number;
  currentCol: number;
  isGameOver: boolean;
  isWinner: boolean;
};

const createInitialBoard = (): BoardState =>
  Array(MAX_ATTEMPTS)
    .fill(null)
    .map(() =>
      Array(WORD_LENGTH)
        .fill(null)
        .map(() => ({ letter: "", state: "" }))
    );

const createInitialKeyboard = (): Record<string, CellState> =>
  Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").reduce((obj, key) => {
    obj[key] = "";
    return obj;
  }, {} as Record<string, CellState>);

const App = () => {
  const [targetWord, setTargetWord] = createSignal("");
  const [currentRow, setCurrentRow] = createSignal(0);
  const [currentCol, setCurrentCol] = createSignal(0);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [isWinner, setIsWinner] = createSignal(false);
  const [shakeRow, setShakeRow] = createSignal(-1);
  const [revealRow, setRevealRow] = createSignal(-1);
  const [celebration, setCelebration] = createSignal(false);
  const [isGameOverAnimating, setIsGameOverAnimating] = createSignal(false);

  const [board, setBoard] = createStore(createInitialBoard());
  const [keyboard, setKeyboard] = createStore<Record<string, CellState>>(createInitialKeyboard());

  onMount(() => {
    loadGameState();
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  createEffect(() => {
    console.log(targetWord());
  });

  const saveGameState = () => {
    const gameData = {
      board,
      keyboard,
      targetWord: targetWord(),
      currentRow: currentRow(),
      currentCol: currentCol(),
      isGameOver: isGameOver(),
      isWinner: isWinner(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameData));
  };

  const loadGameState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedState) {
      const gameState: GameState = JSON.parse(savedState);

      batch(() => {
        setTargetWord(gameState.targetWord);
        setCurrentRow(gameState.currentRow);
        setCurrentCol(gameState.currentCol);
        setIsGameOver(gameState.isGameOver);
        setIsWinner(gameState.isWinner);
        setBoard(reconcile(gameState.board));
        setKeyboard(reconcile(gameState.keyboard));
      });
    } else {
      generateRandomWord();
    }
  };

  const generateRandomWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isGameOver()) return;

    const key = e.key.toUpperCase();

    if (key === "BACKSPACE") handleDelete();
    else if (key === "ENTER") handleEnter();
    else if (/^[A-Z]$/.test(key)) handleLetter(key);
  };

  const handleLetter = (letter: string) => {
    const row = currentRow();
    const col = currentCol();

    if (col < WORD_LENGTH) {
      setBoard(row, col, "letter", letter);
      setCurrentCol((prevCurrentCol) => prevCurrentCol + 1);
      saveGameState();
    }
  };

  const handleDelete = () => {
    const row = currentRow();
    const col = currentCol();

    if (col > 0) {
      setCurrentCol((prevCurrentCol) => prevCurrentCol - 1);
      setBoard(row, col - 1, "letter", "");
      saveGameState();
    }
  };

  const handleEnter = () => {
    const row = currentRow();
    const currentWord = board[row].map((cell) => cell.letter).join("");

    if (currentWord.length < WORD_LENGTH) {
      setShakeRow(row);
      return;
    }

    const target = targetWord();

    batch(() => {
      for (let i = 0; i < WORD_LENGTH; i++) {
        let state: CellState = "absent";

        if (currentWord[i] === target[i]) state = "correct";
        else if (target.includes(currentWord[i])) state = "present";

        setBoard(row, i, "state", state);
      }

      setRevealRow(row);
    });

    saveGameState();
  };

  const handleCellAnimationEnd = (rowIndex: number, cellIndex: number, animationName: string) => {
    if (animationName === "flip") {
      const row = rowIndex;
      const currentWord = board[row].map((cell) => cell.letter).join("");
      const target = targetWord();
      const letter = currentWord[cellIndex];
      const state = board[row][cellIndex].state;

      if (
        keyboard[letter] === "" ||
        (keyboard[letter] === "absent" && (state === "present" || state === "correct")) ||
        (keyboard[letter] === "present" && state === "correct")
      ) {
        setKeyboard(letter, state);
      }

      if (cellIndex === WORD_LENGTH - 1) {
        batch(() => {
          if (currentWord === target) setCelebration(true);
          else if (row === MAX_ATTEMPTS - 1) setIsGameOver(true);
          else {
            setCurrentCol(0);
            setRevealRow(-1);
            setCurrentRow((prevCurrentRow) => prevCurrentRow + 1);
          }
        });

        saveGameState();
      }
    } else if (animationName === "dance" && cellIndex === WORD_LENGTH - 1) {
      batch(() => {
        setIsWinner(true);
        setIsGameOver(true);
      });

      saveGameState();
    }
  };

  const handleShakeAnimationEnd = () => setShakeRow(-1);

  const handleKeyClick = (key: string) => {
    if (key === "DEL") handleDelete();
    else if (key === "SUB") handleEnter();
    else handleLetter(key);
  };

  const handleReset = () => {
    generateRandomWord();

    batch(() => {
      setIsGameOverAnimating(false);
      setIsGameOver(false);
      setIsWinner(false);
      setCurrentRow(0);
      setCurrentCol(0);
      setShakeRow(-1);
      setRevealRow(-1);
      setCelebration(false);
      setBoard(reconcile(createInitialBoard()));
      setKeyboard(reconcile(createInitialKeyboard()));
    });

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div class="game-container">
      <Board
        board={board}
        shakeRow={shakeRow()}
        revealRow={revealRow()}
        currentCol={currentCol()}
        celebration={celebration()}
        currentRow={currentRow()}
        onCellAnimationEnd={handleCellAnimationEnd}
        onShakeAnimationEnd={handleShakeAnimationEnd}
      />

      <Keyboard keyboard={keyboard} onKeyClick={handleKeyClick} />

      <Show when={isGameOver() || isGameOverAnimating()}>
        <GameOver
          isWinner={isWinner()}
          targetWord={targetWord()}
          isAnimating={isGameOverAnimating()}
          onReset={() => setIsGameOverAnimating(true)}
          onTransitionEnd={handleReset}
        />
      </Show>
    </div>
  );
};

export default App;
