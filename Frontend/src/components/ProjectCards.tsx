import React, { useEffect, useState } from "react";
import "./styles/ProjectCards.css";
import { GoPencil } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Modal from "./sharedComponents/Modal";
import type { Project } from "../types";
import { DESCRIPTION_MAX_LEN } from "../types";
import { TITLE_MAX_LEN } from "../types";

import { toast } from "sonner";

import { api } from "../api";

interface ProjectCardProps {
  project: Project;
  onDeleted?: () => void;
}

const ProjectCards: React.FC<ProjectCardProps> = ({ project, onDeleted }) => {
  const navigate = useNavigate();

  const projectId = project.id;

  const handleOpenBoard = () => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  const [isEditmodalOpen, setIsEditmodalOpen] = useState(false);

  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);

  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");

  const [openTasks, setOpenTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setProjectTitle(project.title ?? "");
    setProjectDescription(project.description ?? "");
    setIsEditmodalOpen(true);
  };

  const handleUpdateProject = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (projectTitle.length > TITLE_MAX_LEN) {
      toast.error(`Title cannot exceed ${TITLE_MAX_LEN} characters.`);
      return;
    }

    if (projectDescription.length > DESCRIPTION_MAX_LEN) {
      toast.error(
        `Description cannot exceed ${DESCRIPTION_MAX_LEN} characters.`,
      );
      return;
    }
    try {
      const response = await api.patch(
        `/api/projects/updateProject/${projectId}`,
        {
          title: projectTitle,
          description: projectDescription,
        },
      );
      if (response.status === 200) {
        console.log("Project updated successfully");
      }
      if (response.status === 500) {
        console.error("Failed to update project: Server error");
      }
    } catch (err) {
      console.error("Failed to update project:", err);
    }
    setIsEditmodalOpen(false);
    onDeleted?.(); // onDeleted is used here to refresh the project list in parent
  };

  const handleThreeDotsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsThreeDotsOpen(!isThreeDotsOpen);
  };

  const handleThreeDotsOptinsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsThreeDotsOpen(false);
  };

  const handleDeleteProject = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.delete(`/api/projects/deleteProject/${projectId}`);
      setIsThreeDotsOpen(false);

      //Implement the deletion of the all tasks belongs to the project
      // deleteAllTasksOfProject/:${projectId}

      // Notify parent about deletion
      onDeleted?.();
    } catch (err) {
      console.error("Failed to delete Project:", err);
    }
  };

  const handleArchieveProject = async (event: React.MouseEvent) => {
    event.stopPropagation();
    toast.error("Archive Project feature is not implemented yet.");
    setIsThreeDotsOpen(false);
  }

  const fetchCount = async () => {
    try {
      const openTaskCountResponse = await api.get<number>(
        `/api/projects/tasks/getOpenTasks/${projectId}`,
      );
      const completedTaskCountResponse = await api.get<number>(
        `/api/projects/tasks/getCompletedTasks/${projectId}`,
      );

      setOpenTasks(openTaskCountResponse.data);
      setCompletedTasks(completedTaskCountResponse.data);

    } catch (error) {
      console.error("Failed to fetch task counts:", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [projectId]);

  return (
    <>
      <div onClick={handleOpenBoard} className="CardsContainer">
        <div className="card-head">
          <div className="card-head-title">
            <h2 className="project-title">{project.title}</h2>
          </div>
          <div className="card-head-action">
            <GoPencil
              className="card-head-action-editIcon"
              onClick={handleEditClick}
            />
            <BsThreeDotsVertical
              className="card-head-action-threeDots"
              onClick={handleThreeDotsClick}
            />
            {isThreeDotsOpen && (
              <div className="three-dots-menu">
                <div
                  className="three-dots-menu-item"
                  onClick={handleEditClick}
                >
                  Edit
                </div>
                <div
                  className="three-dots-menu-item"
                  onClick={handleDeleteProject}
                >
                  Delete
                </div>
                <div
                  className="three-dots-menu-item"
                  onClick={handleArchieveProject}
                >
                  Archive
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Project Edit Modal */}
        <Modal
          isOpen={isEditmodalOpen}
          onClose={() => setIsEditmodalOpen(false)}
        >
          <div className="edit-modal-content">
            <h2>Edit {project.title}</h2>
            <form className="edit-project-form" onSubmit={handleUpdateProject}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  maxLength={TITLE_MAX_LEN}
                  type="text"
                  id="title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  maxLength={DESCRIPTION_MAX_LEN}
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              <div className="form-group project-edit-save-btn">
                <button type="submit">Save Changes</button>{" "}
              </div>
            </form>
          </div>
        </Modal>
        <div className="card-description">
          <span className="project-description">{project.description}</span>
        </div>
        <div className="project-meta">
          <span className="card-progress">
            <span className="progressText">
              {openTasks} open / {completedTasks + openTasks} tasks
            </span>
            <progress
              className="progress-bar"
              value={openTasks}
              max={completedTasks + openTasks}
            />
          </span>
        </div>

        <div className="project-card-footer">
          <span>Last updated: ---- </span>

          <div className="asignee-image">
            <img src="https://picsum.photos/50" alt="Asignee Profile Image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCards;
