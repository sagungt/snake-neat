import React from "react";
import "../styles/switch.css";

interface Props {
  value: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  disabled?: boolean;
}

export default function Switch(props: Props) {
  return (
    <span
      className={
        "switch" +
        (props.value ? " active" : "") +
        (props.disabled ? " disabled" : "")
      }
      onClick={props.disabled ? () => false : props.onToggle}
    >
      <span className="switch-label">{props.label}</span>
      {props.value ? (
        <i className="fa fa-toggle-on fa-fw"></i>
      ) : (
        <i className="fa fa-toggle-off fa-fw"></i>
      )}
    </span>
  );
}
