import React, { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment, TextField } from "@mui/material";

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
    <TextField
        fullWidth
        onChange={handleChange}
        placeholder={placeholder}
        name="searchText"
        value={searchText}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
  );
};

export default InputBox;
