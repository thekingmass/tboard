import React from "react";
import FilterComp from "../sharedComponents/FilterComp";
import SortComp from "../sharedComponents/SortComp";
import { Paper, Stack } from "@mui/material";



const FilterSortComponent: React.FC = () => {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.68)", border: "1px solid rgba(148,163,184,0.18)" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <FilterComp />
        <SortComp />
      </Stack>
    </Paper>
  );
};

export default FilterSortComponent;
