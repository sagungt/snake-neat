import { useState, useEffect, ChangeEvent } from "react";
import "../styles/slider.css";

interface Props {
  onChangeEvent: Function;
  value: number;
  name: string;
  max: number;
  min: number;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  step?: number;
}

export default function Slider(props: Props) {
  const [rangeValue, setRangeValue] = useState(0);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    props.onChangeEvent(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    setRangeValue(props.value);
  }, [props.value]);

  return (
    <>
      <div className="slider">
        <span className="slider-label">
          {props.name} {Math.abs(rangeValue)} {props.required ? "*" : ""}
        </span>
        <input
          type="range"
          disabled={props.disabled}
          onChange={onChange}
          value={rangeValue}
          step={props.step}
          name={props.name}
          min={props.min}
          max={props.max}
        />
        <div className="slider-description">
          <span>{props.description}</span>
        </div>
      </div>
    </>
  );
}
