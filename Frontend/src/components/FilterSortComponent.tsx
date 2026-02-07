import React from "react";
import FilterComp from "./sharedComponents/FilterComp";
import SortComp from "./sharedComponents/SortComp";



const FilterSortComponent: React.FC = () => {
  return (
    <div className="FilterSort">
      <div className="Filter">
        <FilterComp />
      </div>
      <div className="Sort">
        <SortComp />
      </div>
    </div>
  );
};

export default FilterSortComponent;
