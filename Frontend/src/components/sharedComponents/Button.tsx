import React from "react";
import "../sharedComponents/Button.css";

interface buttonProps {
  onClick?: () => void;
  buttonText: string;
}

const Button: React.FC<buttonProps> = (props) => {
  const { onClick, buttonText } = props;
  return (
    <button className="btn-component" onClick={onClick} type="button">
      <p className="">{buttonText}</p>
    </button>
  );
};

export default Button;
