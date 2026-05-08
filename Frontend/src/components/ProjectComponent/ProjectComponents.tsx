import React, {useEffect, useState} from "react";
import TopControl from "./TopControl";
import ProjectCards from "./ProjectCards";
// import FilterSortComponent from "../shared/FilterSortComponent";
import type { Project as UiProject, ApiProject } from "../../types";
import { api } from "../../api";
import { Box, Grid, Stack, Typography } from "@mui/material";


const ProjectComponents: React.FC = () => {

  const [searchText, setSearchText] = useState("");

  const [projects, setProjects] = useState<UiProject[]>([]);

  let filteredProjects: UiProject[] = [];

  const fetchProjects = async () => {
    try {

      const res = await api.get<ApiProject[]>("/api/projects");

      // map ApiProject to Ui Project
      const uiProject: UiProject[] = res.data.map((project: ApiProject) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        createdBy: project.createdBy,
        assignedTo: project.assignedTo,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));

      setProjects(uiProject);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const isProjectAvailableForTheUser = () => {
    if (projects.length === 0) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!cancelled) {
        await fetchProjects();
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(
    () => {
      
    }, [projects]
  )

  filteredProjects = projects.filter(project => project.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Stack spacing={2.5}>
      <Box sx={{ px: { xs: 0.5, md: 1 } }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          Your Projects
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track workstreams, open boards, and create new initiatives from one dashboard.
        </Typography>
      </Box>
      <TopControl onSearch={setSearchText} onCreated={fetchProjects} />
      {/* <FilterSortComponent /> */}
      <Grid container spacing={2.5}>
        {isProjectAvailableForTheUser() ?(
          filteredProjects.map(project => (
          <Grid key={project.id} size={{ xs: 12, md: 6, xl: 4 }}>
            <ProjectCards project={project} onDeleted={fetchProjects} />
          </Grid>
        ))
        ) : (
          <Typography>Create Projects to get started</Typography>
        )}
        
      </Grid>
    </Stack>
  );
};

export default ProjectComponents;
