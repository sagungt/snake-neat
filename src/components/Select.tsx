import { ChangeEvent, useState } from "react";
import "../styles/select.css";

interface Option {
  value: string | number;
  recommended: boolean;
  description: string;
}

interface Props {
  onChangeEvent: Function;
  options: Array<Option>;
  disabled: boolean;
  label: string;
  name: string;
  style?: object;
}

export default function Select(props: Props) {
  const recommendedValue =
    props.options.filter((option: Option) => option.recommended)[0] || false;
  const [value, setValue] = useState(recommendedValue.value || "");
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    props.onChangeEvent(newValue);
  };
  return (
    <>
      <span className="select-label">{props.label}</span>
      <select
        defaultValue={value}
        onChange={onChange}
        className="select"
        name={props.name}
        disabled={props.disabled}
        style={props.style}
      >
        {props.options.map((option: any, id: number) => {
          return (
            <option key={id} value={option.value}>
              {option.description} {option.recommended ? "*" : ""}
            </option>
          );
        })}
      </select>
    </>
  );
}
