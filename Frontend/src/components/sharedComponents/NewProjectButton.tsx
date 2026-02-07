import React from "react";
import PlusButton from "./PlusButton";
import "./NewProjectButton.css";


interface NewProjectButtonProps {
    onClick?: () => void;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ onClick }) => {
    return (
        <button className="NewProjectButton" onClick={onClick}>
            <span className="buttonText">New Project</span>
            <PlusButton />
        </button>
    );
}

export default NewProjectButton;
