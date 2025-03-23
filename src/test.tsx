// App.tsx
import { Component, createSignal, For, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import "../App.css";

// Word list and game state
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = [
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

// Types
type CellState = "" | "correct" | "present" | "absent";
type BoardState = Array<Array<{ letter: string; state: CellState }>>;

const App: Component = () => {
  const [targetWord, setTargetWord] = createSignal("");
  const [currentRow, setCurrentRow] = createSignal(0);
  const [currentCol, setCurrentCol] = createSignal(0);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [isWinner, setIsWinner] = createSignal(false);
  const [shakeRow, setShakeRow] = createSignal(-1);
  const [revealRow, setRevealRow] = createSignal(-1);
  const [celebration, setCelebration] = createSignal(false);

  // Initialize board
  const [board, setBoard] = createStore<BoardState>(
    Array(MAX_ATTEMPTS)
      .fill(null)
      .map(() =>
        Array(WORD_LENGTH)
          .fill(null)
          .map(() => ({ letter: "", state: "" }))
      )
  );

  // Set up keyboard tracking
  const [keyboard, setKeyboard] = createStore<Record<string, CellState>>(
    Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {} as Record<string, CellState>)
  );

  // Initialize the game
  onMount(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    console.log("Target word:", randomWord); // For debugging

    // Add keyboard event listener
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isGameOver()) return;

    const key = e.key.toUpperCase();

    if (key === "BACKSPACE") {
      handleDelete();
    } else if (key === "ENTER") {
      handleEnter();
    } else if (/^[A-Z]$/.test(key)) {
      handleLetter(key);
    }
  };

  // Handle letter input
  const handleLetter = (letter: string) => {
    const row = currentRow();
    const col = currentCol();

    if (col < WORD_LENGTH) {
      // Update board with the letter
      setBoard(row, col, "letter", letter);

      // Play scale animation by adding and removing class
      const cell = document.querySelector(`.row-${row} .cell-${col}`);
      cell?.classList.add("scale");
      setTimeout(() => cell?.classList.remove("scale"), 100);

      // Move to next column
      setCurrentCol(col + 1);
    }
  };

  // Handle delete/backspace
  const handleDelete = () => {
    const row = currentRow();
    const col = currentCol();

    if (col > 0) {
      setCurrentCol(col - 1);
      setBoard(row, col - 1, "letter", "");
    }
  };

  // Handle enter key press
  const handleEnter = () => {
    const row = currentRow();

    // Check if the current row is completely filled
    const currentWord = board[row].map((cell) => cell.letter).join("");

    if (currentWord.length < WORD_LENGTH) {
      // Shake animation for incomplete word
      setShakeRow(row);
      setTimeout(() => setShakeRow(-1), 500);
      return;
    }

    // Check if the word is correct
    const target = targetWord();

    // Evaluate each letter
    for (let i = 0; i < WORD_LENGTH; i++) {
      let state: CellState = "absent";

      if (currentWord[i] === target[i]) {
        state = "correct";
      } else if (target.includes(currentWord[i])) {
        state = "present";
      }

      // Update keyboard state
      const letter = currentWord[i];
      if (
        keyboard[letter] === "" ||
        (keyboard[letter] === "absent" && state !== "absent") ||
        (keyboard[letter] === "present" && state === "correct")
      ) {
        setKeyboard(letter, state);
      }

      // We'll set the cell state but reveal it after animation
      setBoard(row, i, "state", state);
    }

    // Start the flip animation
    setRevealRow(row);

    // Check if the player won
    if (currentWord === target) {
      setTimeout(() => {
        setCelebration(true);
        setIsWinner(true);
        setIsGameOver(true);
      }, 1500);
    } else if (row === MAX_ATTEMPTS - 1) {
      // Game over - no more attempts
      setTimeout(() => {
        setIsGameOver(true);
      }, 1500);
    } else {
      // Move to next row
      setTimeout(() => {
        setCurrentRow(row + 1);
        setCurrentCol(0);
        setRevealRow(-1);
      }, 1500);
    }
  };

  // Handle virtual keyboard click
  const handleKeyClick = (key: string) => {
    if (key === "⌫") {
      handleDelete();
    } else if (key === "Enter") {
      handleEnter();
    } else {
      handleLetter(key);
    }
  };

  // Reset the game
  const resetGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    console.log("New target word:", randomWord);

    setCurrentRow(0);
    setCurrentCol(0);
    setIsGameOver(false);
    setIsWinner(false);
    setShakeRow(-1);
    setRevealRow(-1);
    setCelebration(false);

    // Reset board
    setBoard(
      Array(MAX_ATTEMPTS)
        .fill(null)
        .map(() =>
          Array(WORD_LENGTH)
            .fill(null)
            .map(() => ({ letter: "", state: "" }))
        )
    );

    // Reset keyboard
    Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").forEach((key) => {
      setKeyboard(key, "");
    });
  };

  return (
    <div class="wordle-container">
      <header>
        <h1>Wordle Clone</h1>
      </header>

      <div class="game-board">
        <For each={board}>
          {(row, rowIndex) => (
            <div
              class={`row row-${rowIndex()} 
                ${shakeRow() === rowIndex() ? "shake" : ""} 
                ${celebration() && isWinner() ? "celebrate" : ""}`}
            >
              <For each={row}>
                {(cell, colIndex) => (
                  <div
                    class={`cell cell-${colIndex()} 
                      ${revealRow() === rowIndex() ? "flip" : ""} 
                      flip-delay-${colIndex()}`}
                    data-state={cell.state}
                  >
                    {cell.letter}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>

      <div class="keyboard">
        <div class="keyboard-row">
          <For each={["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]}>
            {(letter) => (
              <button class={`key ${keyboard[letter]}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </button>
            )}
          </For>
        </div>
        <div class="keyboard-row">
          <div class="spacer half"></div>
          <For each={["A", "S", "D", "F", "G", "H", "J", "K", "L"]}>
            {(letter) => (
              <button class={`key ${keyboard[letter]}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </button>
            )}
          </For>
          <div class="spacer half"></div>
        </div>
        <div class="keyboard-row">
          <button class="key wide" onClick={() => handleKeyClick("Enter")}>
            Enter
          </button>
          <For each={["Z", "X", "C", "V", "B", "N", "M"]}>
            {(letter) => (
              <button class={`key ${keyboard[letter]}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </button>
            )}
          </For>
          <button class="key wide" onClick={() => handleKeyClick("⌫")}>
            ⌫
          </button>
        </div>
      </div>

      {isGameOver() && (
        <div class="game-over">
          <h2>{isWinner() ? "You Won!" : "Game Over"}</h2>
          <p>The word was: {targetWord()}</p>
          <button class="reset-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
