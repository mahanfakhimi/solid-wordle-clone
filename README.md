# SolidJS Wordle Clone

A modern implementation of the popular word-guessing game Wordle built with SolidJS.

## 🎮 Demo

[Live Demo](https://solid-wordle-clone.netlify.app/)

## ✨ Features

- **SolidJS Reactivity**: Leverages SolidJS for efficient state management and DOM updates
- **Responsive Design**: Fully responsive for desktop and mobile play
- **Beautiful Animations**: Includes flip, shake, and celebration animations
- **Local Storage**: Game state is saved to continue where you left off
- **Virtual Keyboard**: On-screen keyboard that updates with color feedback
- **Modern UI**: Clean, minimal interface that focuses on gameplay

## 🛠️ Technologies

- [SolidJS](https://www.solidjs.com/) - A declarative, efficient and flexible JavaScript library for building user interfaces
- TypeScript - For static type checking
- CSS Animations - For smooth game feedback
- Local Storage API - For game state persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solidjs-wordle-clone.git
   cd solidjs-wordle-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to `http://localhost:5173`

## 📝 How to Play

1. The objective is to guess a 5-letter word within 6 attempts.
2. Type your guess using your keyboard or the on-screen keys.
3. After submitting a guess:
   - Green tiles indicate correct letters in the correct position
   - Yellow tiles indicate correct letters in the wrong position
   - Gray tiles indicate letters not in the word
4. Use these hints to refine your guesses and solve the puzzle!

## 🧠 Game Logic

- The game randomly selects a 5-letter word from a predefined list
- Each row represents one attempt at guessing the word
- After a guess is submitted, the game evaluates each letter:
  - Correct letter, correct position → Green
  - Correct letter, wrong position → Yellow
  - Letter not in word → Gray
- The keyboard updates to show which letters have been used and their status
- The game ends when the player correctly guesses the word or runs out of attempts

## 📁 Project Structure

```
src/
├── components/     # UI components
│   ├── Board.tsx   # Game board component
│   ├── Cell.tsx    # Individual letter cell
│   ├── GameOver.tsx # Game over overlay
│   ├── Key.tsx     # Keyboard key component
│   ├── Keyboard.tsx # Virtual keyboard
│   └── Row.tsx     # Row of cells
├── utils/          # Utility functions
├── App.tsx         # Main game logic
├── index.tsx       # Application entry point
└── index.css       # Global styles
```

## 🎨 Customization

You can easily customize various aspects of the game:

- Modify the word list in `App.tsx` to change possible target words
- Adjust the number of attempts by changing `MAX_ATTEMPTS`
- Update the color scheme in `index.css` by modifying CSS variables:
  ```css
  :root {
    --correct-color: #6aaa64;
    --present-color: #c9b458;
    --absent-color: #787c7e;
    /* and more... */
  }
  ```

## 📱 Responsive Design

The game adapts to different screen sizes:
- Desktop: Full-sized keyboard and game board
- Mobile: Compact keyboard and appropriately sized game elements
