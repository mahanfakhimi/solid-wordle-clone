import { For } from "solid-js";
import type { CellState } from "../App";
import Key from "./Key";

type KeyboardProps = {
  keyboard: Record<string, CellState>;
  onKeyClick: (key: string) => void;
};

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Keyboard = (props: KeyboardProps) => {
  return (
    <div class="keyboard">
      <div class="keyboard-row">
        <For each={ROWS[0]}>
          {(letter) => (
            <Key letter={letter} state={props.keyboard[letter]} onClick={props.onKeyClick} />
          )}
        </For>
      </div>

      <div class="keyboard-row">
        <For each={ROWS[1]}>
          {(letter) => (
            <Key letter={letter} state={props.keyboard[letter]} onClick={props.onKeyClick} />
          )}
        </For>
      </div>

      <div class="keyboard-row">
        <Key letter="DEL" isWide={true} onClick={props.onKeyClick} />

        <For each={ROWS[2]}>
          {(letter) => (
            <Key letter={letter} state={props.keyboard[letter]} onClick={props.onKeyClick} />
          )}
        </For>

        <Key letter="SUB" isWide={true} onClick={props.onKeyClick} />
      </div>
    </div>
  );
};

export default Keyboard;
