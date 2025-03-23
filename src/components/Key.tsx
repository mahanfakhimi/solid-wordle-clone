import type { CellState } from "../App";

type KeyProps = {
  letter: string;
  state?: CellState;
  isWide?: boolean;
  onClick: (key: string) => void;
};

const Key = (props: KeyProps) => {
  const handleClick = () => props.onClick(props.letter);

  return (
    <button
      onClick={handleClick}
      class={`key ${props.isWide ? "wide" : ""}`}
      data-state={props.state}
    >
      {props.letter}
    </button>
  );
};

export default Key;
