import cn from "../utils/cn";

type GameOverProps = {
  isWinner: boolean;
  targetWord: string;
  isAnimating: boolean;
  onReset: () => void;
  onTransitionEnd: () => void;
};

const GameOver = (props: GameOverProps) => {
  let hasTransitionEnded = false;

  const handleTransitionEnd = () => {
    if (!hasTransitionEnded) {
      hasTransitionEnded = true;
      props.onTransitionEnd();
    }
  };

  const handleReset = () => {
    hasTransitionEnded = false;
    props.onReset();
  };

  return (
    <>
      <div
        class={cn("game-over", props.isAnimating && "scale-out")}
        onTransitionEnd={handleTransitionEnd}
      >
        <h2>{props.isWinner ? "You Win" : "Game Over"}</h2>
        <p>The Word Was: {props.targetWord}</p>
        <button onClick={handleReset} class="reset-button">
          Play Again
        </button>
      </div>

      <div class={cn("backdrop", props.isAnimating && "hide")} />
    </>
  );
};

export default GameOver;
