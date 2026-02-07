import React from "react";
import "../sharedComponents/SortComp.css";
import { BiSortAlt2 } from "react-icons/bi";

const sortOptions = [
    { value: "dateModified", label: "Date Modified" },
    { value: "name", label: "Name" },
    { value: "dateCreated", label: "Date Created" },
    { value: "priority", label: "Priority" },
];

const SortComp: React.FC = () => {
    return (
        <div className="SortWrapper">
            <BiSortAlt2 className="sort-icon" />
            <select className="sort-dropdown" id="sortSelect" name="sortSelect">
                {sortOptions.map(option => (
                    <option style={{ width: "250px" }} key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortComp;
