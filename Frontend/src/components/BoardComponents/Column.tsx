// Column.tsx
import React, { useState } from "react";
import type { Task, ApiTask, CreateTaskPayload, Priority } from "../../types";
import { mapApiTaskToTask } from "../../types";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import { api } from "../../api";
import { toast } from "sonner";
import {
  alpha,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";

interface ColumnProps {
  id: string;
  projectId: string;
  title: string;
  tasks: Task[];
  updateUiOnTaskCreation?: (task: Task) => void;
  updateUiOnDelete?: (taskId: string) => void;
  updateUiOnTaskUpdate?: (updatedTask: Task) => void;
  updateUiOnTagAdd?: (updatedTask: Task) => void;
  updateUiOnTagRemove?: (updatedTask: Task) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  projectId,
  title,
  tasks,
  updateUiOnTaskCreation,
  updateUiOnDelete,
  updateUiOnTaskUpdate,
  updateUiOnTagAdd,
  updateUiOnTagRemove,
}) => {
  // console.log("tasks in column:", title, tasks);

  const [taskModalOpen, setTaskModal] = useState(false);

  //Form Input Fields - to make it controlled components
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("low");
  const [taskTagsInutField, settaskTagsInutField] = useState<string>("");
  const [status, setStatus] = useState<string>("in progress");
  const [newTaskOrder, setNewTaskOrder] = useState<number>(tasks.length);

  const onCreateTaskSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    // Handle task creation logic here
    setTaskModal(false);

    try {
      if (!taskTitle.trim() || !taskPriority.trim()) {
        toast.error("Task and Priority fields are required.");
        return;
      }

      // Build strongly-typed payload
      const payload: CreateTaskPayload = {
        title: taskTitle,
        priority: taskPriority as Priority,
        tags: taskTagsInutField,
        status,
        order: newTaskOrder,
        projectId,
        columnId: id,
      };

      // Creating the task in DB via API call — response is { message, task }
      const res = await api.post<{ message: string; task: ApiTask }>("/api/tasks/createTask", payload);

      // Convert API response to UI Task using the mapper
      // Backend returns { message, task }, so we need res.data.task
      if(res){
        toast.success(res.data.message);
      }
      const newTask: Task = mapApiTaskToTask(res.data.task);

      // Update UI immediately (no refresh) by informing the parent.
      updateUiOnTaskCreation?.(newTask);

      //reset the form fields
      setTaskTitle("");
      setTaskPriority("low");
      settaskTagsInutField("");
      setStatus("in progress");
      setNewTaskOrder(tasks.length + 1);
    } catch (error: unknown) {
      const requestError = error as { response?: { data?: { message?: string } } };
      console.error("Error validating task input:", error);
      toast.error(requestError.response?.data?.message || "Failed to create task.");
    }
  };

  return (
    <Paper
      data-column-id={id}
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: 340 },
        minWidth: { xs: "100%", sm: 340 },
        maxHeight: "100%",
        borderRadius: 5,
        bgcolor: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
        boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={2} sx={{ p: 2.25, pb: 1.5 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.4 }}>
              Workflow lane
            </Typography>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Stack>
          <Badge
            badgeContent={tasks.length}
            color="primary"
            sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: alpha("#2563eb", 0.28),
                border: "1px solid rgba(37, 99, 235, 0.32)",
              }}
            />
          </Badge>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddTaskRoundedIcon />}
          onClick={() => setTaskModal(true)}
          sx={{
            alignSelf: "stretch",
            justifyContent: "flex-start",
            borderRadius: 3,
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
            boxShadow: "none",
          }}
        >
          Add task
        </Button>
      </Stack>

      <Divider />

      <Dialog open={taskModalOpen} onClose={() => setTaskModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a new task</DialogTitle>
        <Box component="form" onSubmit={onCreateTaskSubmit}>
          <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Task title"
              id="task-title"
              name="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Task priority"
              id="task-priority"
              name="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              fullWidth
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              label="Task tags"
              id="task-tags"
              name="taskTagsInutField"
              helperText="Use commas to add multiple tags."
              value={taskTagsInutField}
              onChange={(e) => settaskTagsInutField(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setTaskModal(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create task
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Tasks list */}
      {/* Make the column Area Droppable where the tasks will be dropped */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
              p: 1.5,
              minHeight: 180,
              overflowY: "auto",
              backgroundColor: snapshot.isDraggingOver 
                ? "rgba(15, 118, 110, 0.08)" 
                : "rgba(248, 250, 252, 0.76)",
              border: snapshot.isDraggingOver 
                ? "2px dashed #0f766e" 
                : "none",
              borderRadius: 3,
              transition: "background-color 150ms ease, border 150ms ease",
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                id={task.id}
                index={index}
                title={task.title}
                priority={task.priority}
                tags={task.tags}
                updateUiOnDelete={updateUiOnDelete}
                updateUiOnTaskUpdate={updateUiOnTaskUpdate}
                updateUiOnTagAdd={updateUiOnTagAdd}
                updateUiOnTagRemove={updateUiOnTagRemove}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default Column;
