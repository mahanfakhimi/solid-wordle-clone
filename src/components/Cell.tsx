import type { CellState } from "../App";
import cn from "../utils/cn";

type CellProps = {
  letter: string;
  state: CellState;
  isActive: boolean;
  isFlipping: boolean;
  isCelebrating: boolean;
  index: number;
  onAnimationEnd?: (animationName: string) => void;
};

const Cell = (props: CellProps) => {
  return (
    <div
      class={cn("cell", props.isFlipping && !props.isCelebrating && "flip")}
      data-state={props.state}
      data-active={props.isActive ? "true" : "false"}
      style={{ "animation-delay": `0.${props.index}s` }}
      onAnimationEnd={(e) => props.onAnimationEnd?.(e.animationName)}
    >
      {props.letter}
    </div>
  );
};

export default Cell;
