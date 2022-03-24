import React, { useEffect, useState } from "react";
import "../styles/field.css";

interface Props {
  type: string;
  name: string;
  value: number;
  required: boolean;
  placeholder: string;
  description: string;
  onChangeEvent: Function;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
}

export default function Field(props: Props) {
  const [value, setValue] = useState(props.value || "");
  const [error, setError] = useState<undefined | string>(undefined);
  const [changeCounter, setChangeCounter] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const currentValue = e.currentTarget.value;

    setValue(currentValue);
    setChangeCounter(changeCounter + 1);
    if (props.onChangeEvent) {
      props.onChangeEvent(parseInt(currentValue, 10));
    }
  };

  useEffect(() => {
    getError();
  });

  const getError = () => {
    if (props.max !== undefined) {
      if (value > props.max) {
        setError(`Maximum value is ${props.max}`);
      } else setError(undefined);
    }
    if (props.min !== undefined) {
      if (value < props.min) {
        setError(`Minimum value is ${props.min}`);
      } else setError(undefined);
    }
    if (props.maxLength !== undefined) {
      if (`${value}`.length > props.maxLength) {
        setError(`Too long: ${`${value}`.length}/${props.maxLength}`);
      } else setError(undefined);
    }
    if (props.minLength !== undefined) {
      if (`${value}`.length > props.minLength) {
        setError(`Must be at least ${props.minLength} character`);
      } else setError(undefined);
    }
    if (value === "" && props.required) {
      setError("Required");
    }
  };

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
      {error ? (
        <div className="field-error">
          <span>{error}</span>
        </div>
      ) : (
        <div className="field-description">
          <span>{props.description}</span>
        </div>
      )}
    </div>
  );
}
