// TaskCard.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { Priority, Task as UiTask } from "../../types";
import { mapApiTaskToTask } from "../../types";

import { Draggable } from "@hello-pangea/dnd";
import { api } from "../../api";
import { toast } from "sonner";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";

interface TaskCardProps {
  id: string;
  index: number;
  title: string;
  priority: Priority;
  tags: string[];
  updateUiOnDelete?: (taskId: string) => void;
  updateUiOnTaskUpdate?: (updatedTask: UiTask) => void;
  updateUiOnTagAdd?: (updatedTask: UiTask) => void;
  updateUiOnTagRemove?: (updatedTask: UiTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  index,
  title,
  priority,
  tags,
  updateUiOnDelete,
  updateUiOnTaskUpdate,
  updateUiOnTagAdd,
  updateUiOnTagRemove,
}) => {
  const priorityTone =
    priority === "high"
      ? { color: "#b91c1c", background: "#fee2e2", border: "#fecaca" }
      : priority === "medium"
        ? { color: "#b45309", background: "#fef3c7", border: "#fde68a" }
        : { color: "#166534", background: "#dcfce7", border: "#bbf7d0" };

  const [isAddTagVisible, setIsAddTagVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form Input States for Edit Task Modal
  const [taskTitle, setTitle] = useState<string>(title);
  const [taskPriority, setTaskPriority] = useState<string>(priority);
  const [taskTags, setTaskTags] = useState<string>(tags.join(", "));

  //Add Tag Input field
  const [addNewTag, setAddNewTag] = useState<string>("");

  const handleAddTagButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditModalOpen(false);
    setIsAddTagVisible(true);
  };

const handleAddTagSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const response = await api.post(`/api/tasks/addTagToTask/${id}`, {
        addNewTag
      })

      console.log("Add Tag Response:",response.data);
      // Mapping the updated task from API response to UiTask
      const updatedTask = mapApiTaskToTask(response.data.updateResponse
);

      console.log("Updated task",updatedTask);
      toast.success(response.data.message);

      setIsAddTagVisible(false);
      setAddNewTag("");

      // Inform parent component to update the UI
      updateUiOnTagAdd?.(updatedTask);

    } catch(error){
      console.error("Error adding tag:", error);
      toast.error("Failed to add tag.");
    }
  }

  const handleEditTaskClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAddTagVisible(false);
    setIsEditModalOpen(true);
  };

  const handleTaskDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?",
      );
      if (confirmDelete) {
        // Call API to delete task here
        await api.delete(`/api/tasks/deleteTask/${id}`);
        toast.success("Task deleted successfully");
        console.log("Task deleted with ID:", id);

        // Call onDelete callback to update parent component
        if (updateUiOnDelete) {
          updateUiOnDelete(id);
        }
      } else {
        console.log("Task deletion cancelled.");
      }
      console.log("Delete task with ID:", id);
    } catch (error) {
      console.log("Error deleting task:", error);
      toast.error("Error deleting task:");
    }
  };

  const handleUpdateButtonClick = async () => {
    setIsEditModalOpen(false);

    try {
      const response = await api.patch(`/api/tasks/updateTask/${id}`, {
        title: taskTitle,
        priority: taskPriority,
        tags: taskTags,
      });

      const responseTask = response.data.updateResponse;
      console.log("Task update response:", responseTask);
      // Mapping the updated task from API response to UiTask
      const updatedTask = mapApiTaskToTask(responseTask);
      // Update the UI by informing the parent component
      updateUiOnTaskUpdate?.(updatedTask);

      const responseMessage = response.data.message;
      toast.success(responseMessage);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task:");
    }
  };

  const removeTag = async(tagToBeRemoved: string) => {
    // console.log("Removing tag:", tagToBeRemoved);
    try {
      const deleteTagResponse = await api.delete(`/api/tasks/deleteTagFromTask/${id}`,{
        data: { tagToBeRemoved }
      });

      if(!deleteTagResponse || deleteTagResponse.status !== 200){
        toast.error("Failed to remove tag.");
        return;
      }

      //Mapping the updated task from API response to UiTask
      const updatedTask = mapApiTaskToTask(deleteTagResponse.data.updatedTaskPostTagDelete);
      // Inform parent component to update the UI
      updateUiOnTagRemove?.(updatedTask);

    } catch(error) {
      console.error("Error removing tag:", error);
      toast.error("Failed to remove tag.");
    }
  };

  return (
    // make the task card draggable by wrapping it with Draggable component
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        const taskCardNode = (
          <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
          task-data-id={id}
          elevation={snapshot.isDragging ? 8 : 0}
          sx={{
            position: "relative",
            zIndex: snapshot.isDragging ? 1600 : "auto",
            borderRadius: 3,
            border: snapshot.isDragging 
              ? "2px solid #1d4ed8" 
              : "1px solid rgba(226, 232, 240, 0.95)",
            boxShadow: snapshot.isDragging 
              ? "0 20px 50px rgba(29, 78, 216, 0.35)" 
              : "0 10px 28px rgba(15, 23, 42, 0.06)",
            transition: "all 160ms ease",
            backgroundColor: snapshot.isDragging ? "rgba(29, 78, 216, 0.03)" : "white",
            opacity: snapshot.isDragging ? 0.95 : 1,
            "&:hover": {
              boxShadow: snapshot.isDragging 
                ? "0 20px 50px rgba(29, 78, 216, 0.35)"
                : "0 16px 36px rgba(15, 23, 42, 0.10)",
              borderColor: snapshot.isDragging ? "#1d4ed8" : "rgba(59, 130, 246, 0.28)",
            },
          }}
        >
          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
              >
                <Stack direction="row" spacing={0.5} sx={{ minWidth: 0, flex: 1, alignItems: "flex-start" }}>
                  <Tooltip title="Drag task">
                    <IconButton
                      size="small"
                      {...provided.dragHandleProps}
                      sx={{
                        mt: -0.25,
                        color: "text.secondary",
                        cursor: "grab",
                        touchAction: "none",
                      }}
                    >
                      <DragIndicatorRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="subtitle1" sx={{ lineHeight: 1.3, wordBreak: "break-word", fontWeight: 700 }}>
                    {title}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.25}>
                  <Tooltip title="Edit task">
                    <IconButton size="small" onClick={handleEditTaskClick}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton size="small" color="error" onClick={handleTaskDeleteClick}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                <Chip
                  icon={<FlagRoundedIcon />}
                  label={priority.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    color: priorityTone.color,
                    bgcolor: priorityTone.background,
                    border: `1px solid ${priorityTone.border}`,
                    ".MuiChip-icon": { color: priorityTone.color },
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => removeTag(tag)}
                  deleteIcon={<CloseRoundedIcon />}
                  sx={{
                    bgcolor: alpha("#2563eb", 0.08),
                    color: "#1d4ed8",
                    border: "1px solid rgba(37, 99, 235, 0.16)",
                  }}
                />
              ))}
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={handleAddTagButtonClick}
                  sx={{
                    minWidth: 0,
                    px: 1,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Add tag
                </Button>
              </Stack>
            </Stack>
            {/* Add Tag Modal Goes Below */}
            <Dialog
              open={isAddTagVisible}
              onClose={() => setIsAddTagVisible(false)}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>Add tags</DialogTitle>
              <Box component="form" onSubmit={handleAddTagSubmit}>
                <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
                  <TextField
                    label="Tags"
                    placeholder="Design, backend, urgent"
                    name="tagToBeAdded"
                    id="tagToBeAdded"
                    helperText="Use commas to add multiple tags."
                    value={addNewTag}
                    onChange={(e) => setAddNewTag(e.target.value)}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                  <Button onClick={() => setIsAddTagVisible(false)} color="inherit">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Add tag
                  </Button>
                </DialogActions>
              </Box>
            </Dialog>

          {/* Edit Task Modal Goes Below */}
            <Dialog
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Edit task</DialogTitle>
              <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
                <TextField
                  label="Task title"
                  id="edit-task-title"
                  value={taskTitle}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(event.target.value);
                  }}
                  fullWidth
                />
                <TextField
                  select
                  label="Task priority"
                  name="edit-task-priority"
                  id="edit-task-priority"
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
                  id="edit-task-tags"
                  helperText="Keep tags comma separated."
                  value={taskTags}
                  onChange={(e) => setTaskTags(e.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={() => setIsEditModalOpen(false)} color="inherit">
                  Cancel
                </Button>
                <Button type="button" variant="contained" onClick={handleUpdateButtonClick}>
                  Update task
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
        );

        if (snapshot.isDragging) {
          return createPortal(taskCardNode, document.body);
        }

        return taskCardNode;
      }}
    </Draggable>
  );
};

export default TaskCard;
