import React, {useEffect, useState} from "react";
import TopControl from "./TopControl";
import ProjectCards from "./ProjectCards";
import FilterSortComponent from "./FilterSortComponent";
import "./styles/ProjectComponents.css";
import type { Project as UiProject, ApiProject } from "../types";
import { api } from "../api";


const ProjectComponents: React.FC = () => {

  const [searchText, setSearchText] = useState("");

  const [projects, setProjects] = useState<UiProject[]>([]);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => project.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div>
      <TopControl onSearch={setSearchText} onCreated={fetchProjects} />
      <div className="FilterSort">
        <FilterSortComponent />
      </div>
      <div className="cards">
        {filteredProjects.map(project => (
          <ProjectCards key={project.id} project={project} onDeleted={fetchProjects} />
        ))}
      </div>
    </div>
  );
};

export default ProjectComponents;
