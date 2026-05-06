import React, { useState, useRef, useEffect } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
  Checkbox,
  FormControlLabel,
  ListSubheader,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          startIcon={<FilterAltOutlinedIcon />}
          onClick={(event) => {
            setShowDropdown((prev) => !prev);
            setAnchorEl(event.currentTarget);
          }}
          sx={{ justifyContent: "flex-start" }}
        >
          {selectedFilters.length ? `Filter (${selectedFilters.length})` : "Filter"}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={showDropdown}
          onClose={() => setShowDropdown(false)}
        >
          <ListSubheader>Project status</ListSubheader>
          {filterOptions.map(option => (
            <MenuItem key={option} onClick={() => handleCheckboxChange(option)}>
              <FormControlLabel
                control={<Checkbox checked={selectedFilters.includes(option)} />}
                label={option}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default FilterComp;