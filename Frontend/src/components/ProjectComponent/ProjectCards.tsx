import React, { useEffect, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate } from "react-router-dom";
import Modal from "../sharedComponents/Modal";
import type { Project } from "../../types";
import { DESCRIPTION_MAX_LEN } from "../../types";
import { TITLE_MAX_LEN } from "../../types";

import { toast } from "sonner";

import { api } from "../../api";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";

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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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
    setMenuAnchorEl(event.currentTarget as HTMLElement);
    setIsThreeDotsOpen(true);
  };

  const handleDeleteProject = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.delete(`/api/projects/deleteProject/${projectId}`);
      setIsThreeDotsOpen(false);
      setMenuAnchorEl(null);

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
    setMenuAnchorEl(null);
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const [openTaskCountResponse, completedTaskCountResponse] = await Promise.all([
          api.get<number>(`/api/projects/tasks/getOpenTasks/${projectId}`),
          api.get<number>(`/api/projects/tasks/getCompletedTasks/${projectId}`),
        ]);

        if (!cancelled) {
          setOpenTasks(openTaskCountResponse.data);
          setCompletedTasks(completedTaskCountResponse.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch task counts:", error);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const totalTasks = completedTasks + openTasks;
  const completionValue = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <Card onClick={handleOpenBoard} sx={{ borderRadius: 5, cursor: "pointer", height: "100%", border: "1px solid rgba(148,163,184,0.16)", bgcolor: "rgba(255,255,255,0.82)" }}>
        <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }} spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary">Project</Typography>
              <Typography variant="h5" sx={{ wordBreak: "break-word" }}>{project.title}</Typography>
            </Box>
            <Stack direction="row" spacing={0.25}>
              <Tooltip title="Edit project">
                <IconButton onClick={handleEditClick}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton onClick={handleThreeDotsClick}>
                  <MoreVertRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Menu anchorEl={menuAnchorEl} open={isThreeDotsOpen} onClose={() => { setIsThreeDotsOpen(false); setMenuAnchorEl(null); }}>
            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
            <MenuItem onClick={handleArchieveProject}>Archive</MenuItem>
          </Menu>
          
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip icon={<DescriptionOutlinedIcon fontSize="small" />} label={`${totalTasks} tasks`} size="small" variant="outlined" />
            <Chip label={`${openTasks} open`} size="small" color="warning" variant="outlined" />
            <Chip label={`${completedTasks} completed`} size="small" color="success" variant="outlined" />
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.description}
          </Typography>

          <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
              <Typography variant="body2" color="text.secondary">Progress</Typography>
              <Typography variant="body2" color="text.secondary">{Math.round(completionValue)}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={completionValue} sx={{ height: 10, borderRadius: 3 }} />
          </Box>

          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">Last updated: recently</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Avatar src="https://picsum.photos/50" alt="Assignee Profile Image" />
              <Button variant="text" endIcon={<LaunchRoundedIcon />} sx={{ minWidth: 0, px: 0.5 }}>
                Open board
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {/* Project Edit Modal */}
      <Modal
        isOpen={isEditmodalOpen}
        onClose={() => setIsEditmodalOpen(false)}
        title={`Edit ${project.title}`}
        maxWidth="sm"
      >
        <Box component="form" sx={{ display: "grid", gap: 2, pt: 1 }} onSubmit={handleUpdateProject}>
          <TextField
            label="Title"
            type="text"
            id="title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            slotProps={{ htmlInput: { maxLength: TITLE_MAX_LEN } }}
          />
          <TextField
            label="Description"
            multiline
            minRows={4}
            id="description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX_LEN } }}
          />
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
            <Button color="inherit" onClick={() => setIsEditmodalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectCards;
