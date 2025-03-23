import { For } from "solid-js";
import type { BoardState } from "../App";
import Row from "./Row";

type BoardProps = {
  board: BoardState;
  shakeRow: number;
  revealRow: number;
  celebration: boolean;
  currentRow: number;
  currentCol: number;
  onCellAnimationEnd: (rowIndex: number, cellIndex: number, animationName: string) => void;
  onShakeAnimationEnd: () => void;
};

const Board = (props: BoardProps) => {
  return (
    <div class="game-board">
      <For each={props.board}>
        {(row, rowIndex) => (
          <Row
            cells={row}
            rowIndex={rowIndex()}
            isShaking={props.shakeRow === rowIndex()}
            isCelebrating={props.celebration && rowIndex() === props.currentRow}
            isRevealing={props.revealRow === rowIndex() && !props.celebration}
            onCellAnimationEnd={(cellIndex, animationName) =>
              props.onCellAnimationEnd(rowIndex(), cellIndex, animationName)
            }
            onShakeAnimationEnd={props.onShakeAnimationEnd}
          />
        )}
      </For>
    </div>
  );
};

export default Board;
