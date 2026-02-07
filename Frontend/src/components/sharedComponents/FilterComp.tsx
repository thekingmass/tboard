import React, { useState, useRef, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import "./FilterComp.css";

const filterOptions = [
  "In Progress",
  "Completed",
  "On Hold",
  "Archived"
];

const FilterComp: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (option: string) => {
    setSelectedFilters(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="FilterWrapper">
      <div className="Filter" ref={dropdownRef} style={{ position: "relative" }}>
        <button
          type="button"
          className="filter-dropdown-btn"
          onClick={() => setShowDropdown(prev => !prev)}
        >
          <CiFilter /> <span>Filter</span> <IoIosArrowDown />
        </button>
        {showDropdown && (
          <div className="filter-dropdown">
            {filterOptions.map(option => (
              <label className="filter-option" key={option}>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterComp;