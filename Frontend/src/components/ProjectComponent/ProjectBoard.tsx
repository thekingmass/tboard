import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../BoardComponents/Column";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { api } from "../../api";

import { toast } from "sonner";

import {
  alpha,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";

import type {
  ApiColumn,
  Column as UiColumn,
  ApiTask,
  Task as UiTask,
  Project as UiProject,
  ApiProject,
} from "../../types";

import {
  mapApiTaskToTask,
  mapApiColumnToColumn,
  mapApiProjectToProject,
} from "../../types";


const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{
    projectId: string;
    name: string;
    description: string;
  }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<UiTask[]>([]);
  const [columns, setColumns] = useState<UiColumn[]>([]);
  const [projectData, setProjectData] = useState<UiProject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const updateUiOnTaskCreation = (task: UiTask) => {
    setTasks((prev) => {
      // Avoid duplicates if API returns and UI already has it.
      if (prev.some((t) => t.id === task.id)) return prev;
      return [...prev, task];
    });
  };

  const updateUiOnDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateUiOnTaskUpdate = (updatedTask: UiTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const updateUiOnTagAdd = (updatedTask: UiTask) => { 
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const updateUiOnTagRemove = (updatedTask: UiTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const onDragEnd = async (result: DropResult) => {
    // Handle drag and drop logic here
    console.log(typeof result, "Drag Result:->", result);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const res = await api.patch("/api/tasks/updateTaskOnDragEnd", { result });

    if (res.status !== 200) {
      toast.error("Failed to move the task");
      return;
    }

    console.log("API Response on Drag End:", res.data);

    setTasks((prevTasks) => {
      // Find the dragged task
      const draggedTask = prevTasks.find((task) => task.id === draggableId);
      if (!draggedTask) return prevTasks;

      // Remove from old position
      const newTasks = prevTasks.filter((task) => task.id !== draggableId);

      // Update the columnId of the dragged task
      const updatedTask = { ...draggedTask, columnId: destination.droppableId };

      // Insert into new position
      newTasks.splice(destination.index, 0, updatedTask);

      return newTasks;
    });
  };

  useEffect(() => {
    if (!projectId) return;

    // Best practice: cancel in-flight requests when projectId changes or component unmounts.
    // This prevents stale responses from overwriting the current project's state.
    const controller = new AbortController();

    (async () => {
      try {
        const [columnsResponse, tasksResponse, projectResponse] =
          await Promise.all([
            api.get<ApiColumn[]>(`/api/projects/columns/${projectId}`, {
              signal: controller.signal,
            }),
            api.get<ApiTask[]>(`/api/projects/tasks/${projectId}`, {
              signal: controller.signal,
            }),
            api.get<ApiProject>(`/api/projects/${projectId}`, {
              signal: controller.signal,
            }),
          ]);

        // map API Column -> UI shape using mapper
        const uiColumns: UiColumn[] = columnsResponse.data
          .map(mapApiColumnToColumn)
          .sort((a, b) => a.order - b.order);
        setColumns(uiColumns);

        // Map API Task -> UI Task using mapper
        const uiTasks: UiTask[] = tasksResponse.data.map(mapApiTaskToTask);
        setTasks(uiTasks);

        // Map Project -> UiProject using mapper
        const projectData: UiProject = mapApiProjectToProject(projectResponse.data);

        setProjectData(projectData);
      } catch (error: unknown) {
        // Ignore abort/cancel errors (expected during navigation or refresh)
        const requestError = error as {
          name?: string;
          code?: string;
          config?: { url?: string };
          response?: { status?: number; data?: unknown };
        };
        const name = requestError.name ?? requestError.code;
        if (
          name === "CanceledError" ||
          name === "ERR_CANCELED" ||
          name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching columns/tasks:", error);
        console.log("FAILED URL:", requestError.config?.url);
        console.log("STATUS:", requestError.response?.status);
        console.log("DATA:", requestError.response?.data);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [projectId]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = normalizedSearch
    ? tasks.filter((task) => {
        const haystack = [task.title, task.priority, ...task.tags]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
    : tasks;

  return (
    <>
      <Paper
        data-project-id={projectId ?? ""}
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          borderRadius: 3,
          overflow: "visible",
          background:
            "linear-gradient(180deg, rgba(236,244,255,0.92) 0%, rgba(247,250,252,1) 44%, rgba(250,246,238,0.92) 100%)",
          border: "1px solid rgba(148, 163, 184, 0.24)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2.5, md: 3 },
            background:
              "linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #0ea5e9 100%)",
            color: "common.white",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2.5}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Tooltip title="Back to projects">
                  <IconButton
                    onClick={() => navigate("/projects")}
                    sx={{
                      color: "common.white",
                      bgcolor: alpha("#ffffff", 0.14),
                      border: "1px solid rgba(255,255,255,0.2)",
                      "&:hover": { bgcolor: alpha("#ffffff", 0.22) },
                    }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>
                </Tooltip>
                <Chip
                  icon={<DashboardCustomizeRoundedIcon />}
                  label="Project board"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: alpha("#ffffff", 0.14),
                    color: "common.white",
                    border: "1px solid rgba(255,255,255,0.18)",
                    ".MuiChip-icon": { color: "common.white" },
                  }}
                />
              </Stack>
              <Typography variant="h4" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
                {projectData?.title ?? "Untitled"}
              </Typography>
              <Tooltip
                title={(projectData?.description ?? "Untitled").trim() || "Untitled"}
                arrow
                placement="bottom-start"
              >
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 780,
                    color: alpha("#ffffff", 0.86),
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {(projectData?.description ?? "Untitled").trim() || "Untitled"}
                </Typography>
              </Tooltip>
            </Stack>

            <Stack
              spacing={1.5}
              sx={{
                alignItems: { xs: "stretch", lg: "flex-end" },
                justifyContent: "center",
                minWidth: { xs: "100%", lg: 320 },
                maxWidth: 420,
              }}
            >
              <TextField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks, tags, or priority"
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: alpha("#ffffff", 0.75) }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "common.white",
                    bgcolor: alpha("#ffffff", 0.12),
                    borderRadius: 3,
                    "& fieldset": { borderColor: alpha("#ffffff", 0.18) },
                    "&:hover fieldset": { borderColor: alpha("#ffffff", 0.3) },
                    "&.Mui-focused fieldset": { borderColor: "common.white" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: alpha("#ffffff", 0.72),
                    opacity: 1,
                  },
                }}
              />
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                <Chip
                  icon={<ViewKanbanRoundedIcon />}
                  label={`${columns.length} columns`}
                  sx={{
                    bgcolor: alpha("#ffffff", 0.14),
                    color: "common.white",
                    border: "1px solid rgba(255,255,255,0.18)",
                    ".MuiChip-icon": { color: "common.white" },
                  }}
                />
                <Chip
                  label={`${filteredTasks.length} visible tasks`}
                  sx={{
                    bgcolor: alpha("#ffffff", 0.14),
                    color: "common.white",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ display: "flex", flex: 1, minHeight: 0, p: { xs: 1.5, md: 2.5 } }}>
          {/* to make the tasks of the columns draggable and the columns droppable wrap the whole column component with DragDropContext */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                overflowX: "auto",
                alignItems: "flex-start",
                pb: 1,
              }}
            >
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  projectId={projectId!}
                  title={column.title}
                  tasks={filteredTasks.filter((task) => task.columnId === column.id)}
                  updateUiOnTaskCreation={updateUiOnTaskCreation}
                  updateUiOnDelete={updateUiOnDelete}
                  updateUiOnTaskUpdate={updateUiOnTaskUpdate}
                  updateUiOnTagAdd={updateUiOnTagAdd}
                  updateUiOnTagRemove={updateUiOnTagRemove}
                />
              ))}
            </Box>
          </DragDropContext>
        </Box>
      </Paper>
    </>
  );
};

export default ProjectBoard;
