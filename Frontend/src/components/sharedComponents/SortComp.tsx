import React from "react";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import { InputAdornment, MenuItem, TextField } from "@mui/material";

const sortOptions = [
    { value: "dateModified", label: "Date Modified" },
    { value: "name", label: "Name" },
    { value: "dateCreated", label: "Date Created" },
    { value: "priority", label: "Priority" },
];

const SortComp: React.FC = () => {
    return (
        <TextField select defaultValue="dateModified" id="sortSelect" name="sortSelect" sx={{ minWidth: 220 }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SortRoundedIcon color="action" />
                        </InputAdornment>
                    )
                }
            }}>
                {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
    );
};

export default SortComp;
