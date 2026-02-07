import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../sharedComponents/InputBox.css";

interface InputBoxProps {
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ placeholder, onChange }) => {
  const [searchText, setSearchText] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <div className="searchBoxWrapper">
      <FaSearch className="searchIcon" id="searchIcon" />
      <input
        onChange={handleChange}
        type="text"
        placeholder={placeholder}
        name="searchText"
        value={searchText}
      />
    </div>
  );
};

export default InputBox;
