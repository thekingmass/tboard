import React from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Button } from "@mui/material";


interface NewProjectButtonProps {
    onClick?: () => void;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ onClick }) => {
    return (
        <Button variant="contained" startIcon={<AddCircleOutlineRoundedIcon />} onClick={onClick} sx={{ minHeight: 56, px: 3 }}>
            New Project
        </Button>
    );
}

export default NewProjectButton;
