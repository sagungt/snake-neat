import React, { useState, useEffect } from "react";
import "../styles/slider.css";

interface Props {
  min: number;
  max: number;
  name: string;
  value: number;
  onChangeEvent: Function;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  step?: number;
}

export default function Slider(props: Props) {
  const [rangeValue, setRangeValue] = useState(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    props.onChangeEvent(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    setRangeValue(props.value);
  }, [props.value]);

  return (
    <div className="slider">
      <span className="slider-label">
        {props.name} {Math.abs(rangeValue)} {props.required ? "*" : ""}
      </span>
      <input
        type="range"
        name={props.name}
        min={props.min}
        max={props.max}
        value={rangeValue}
        onChange={onChange}
        disabled={props.disabled}
        step={props.step}
      />
      <div className="slider-description">
        <span>{props.description}</span>
      </div>
    </div>
  );
}
