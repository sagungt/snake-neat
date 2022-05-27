import "../styles/controller.css";
import { Direction } from "../helper/Helper";
interface Props {
  onClickEvent: Function;
}

export default function Controller({ onClickEvent }: Props) {
  const changeDirection = (event: any): void => {
    event.preventDefault();
    const currentDirection = event.target.getAttribute("data-direction");
    onClickEvent(currentDirection);
  };
  return (
    <>
      <div className="controller-container">
        <div className="up">
          <button
            type="button"
            id="up"
            className="controller-button"
            data-direction={Direction.UP}
            onClick={changeDirection}
          >
            &#8593;
          </button>
        </div>
        <div className="left-right">
          <button
            type="button"
            id="left"
            className="controller-button"
            data-direction={Direction.LEFT}
            onClick={changeDirection}
          >
            &#8592;
          </button>
          <button
            type="button"
            id="right"
            className="controller-button"
            data-direction={Direction.RIGHT}
            onClick={changeDirection}
          >
            {" "}
            &#8594;
          </button>
        </div>
        <div className="down">
          <button
            type="button"
            id="down"
            className="controller-button"
            data-direction={Direction.DOWN}
            onClick={changeDirection}
          >
            &#8595;
          </button>
        </div>
      </div>
    </>
  );
}
