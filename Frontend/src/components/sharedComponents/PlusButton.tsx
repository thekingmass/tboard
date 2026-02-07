import React from "react";
import { FaPlus } from "react-icons/fa6";
import "./PlusButton.css";

const PlusButton: React.FC = () => {
    return (
        <>
        <FaPlus className="plus-button" id="plus-button" />
        </>
    );
}

export default PlusButton;