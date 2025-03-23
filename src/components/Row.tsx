import { For } from "solid-js";
import type { CellState } from "../App";
import cn from "../utils/cn";
import Cell from "./Cell";

type RowProps = {
  cells: Array<{ letter: string; state: CellState }>;
  rowIndex: number;
  isShaking: boolean;
  isCelebrating: boolean;
  isRevealing: boolean;
  onCellAnimationEnd?: (cellIndex: number, animationName: string) => void;
  onShakeAnimationEnd?: () => void;
};

const Row = (props: RowProps) => {
  return (
    <div
      class={cn("row", props.isShaking && "shake", props.isCelebrating && "celebrate")}
      onAnimationEnd={props.onShakeAnimationEnd}
    >
      <For each={props.cells}>
        {(cell, cellIndex) => (
          <Cell
            letter={cell.letter}
            state={cell.state}
            isActive={cell.letter !== "" && cell.state === ""}
            isFlipping={props.isRevealing}
            isCelebrating={props.isCelebrating}
            index={cellIndex()}
            onAnimationEnd={(animationName) =>
              props.onCellAnimationEnd?.(cellIndex(), animationName)
            }
          />
        )}
      </For>
    </div>
  );
};

export default Row;
