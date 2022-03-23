import React, { useState } from "react";
import "../styles/field.css";

interface Props {
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  value: number;
  onChangeEvent: Function;
  disabled?: boolean;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  minValue?: number;
  maxValue?: number;
}

export default function Field(props: Props) {
  const [value, setValue] = useState(props.value || "");
  const [changeCounter, setChangeCounter] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const currentValue = e.currentTarget.value;

    setValue(currentValue);
    setChangeCounter(changeCounter + 1);
    if (props.onChangeEvent) {
      props.onChangeEvent(parseInt(currentValue, 10));
    }
  };

  // const getError = () => {};

  return (
    <div className="field">
      <div>
        <span className="field-label">
          {(props.placeholder || props.name) + (props.required ? " *" : "")}
        </span>
      </div>
      <input
        className="input"
        type={props.type || "text"}
        name={props.name}
        value={value}
        onChange={handleChange}
        placeholder={
          (props.placeholder || props.name) + (props.required ? " *" : "")
        }
        disabled={props.disabled}
        required={props.required}
        min={props.min}
        max={props.max}
        step={props.step}
      />
      <div className="field-description">
        <span>{props.description}</span>
      </div>
    </div>
  );
}
