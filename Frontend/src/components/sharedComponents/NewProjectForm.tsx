import React, { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";

import { api } from "../../api";
import { TITLE_MAX_LEN } from "../../types"
import { DESCRIPTION_MAX_LEN } from "../../types";
import { toast } from "sonner";

interface NewProjectFormProps {
  onDismiss: () => void;
  onCreated?: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onDismiss,
  onCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");

  const onChangeProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  const onChangeProjectDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setProjectDescription(e.target.value);
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = projectTitle.trim();
    const description = projectDescription.trim();

    if (!title || !description) {
      setSubmitError("Please fill in title and description.");
      return;
    }

    if(title.length > TITLE_MAX_LEN) {
      toast.error(`Title cannot exceed ${TITLE_MAX_LEN} characters.`);
      return;
    }

    if(description.length > DESCRIPTION_MAX_LEN) {
      toast.error(`Description cannot exceed ${DESCRIPTION_MAX_LEN} characters.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post("/api/projects/createNewProject", {
        title,
        description,
        totalTasks: 0,
        openTasks: 0,
      });

      // Reset local state
      setProjectTitle("");
      setProjectDescription("");

      // Let parent know something was created so it can refresh
      onCreated?.();

      onDismiss();
    } catch (err) {
      console.error("Error creating project:", err);
      setSubmitError("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateProject} sx={{ display: "grid", gap: 2 }}>
      <TextField
          label="Project title"
          type="text"
          value={projectTitle}
          onChange={onChangeProjectTitle}
          slotProps={{ htmlInput: { maxLength: TITLE_MAX_LEN } }}
          required
        />
        <TextField
          multiline
          minRows={4}
          label="Project description"
          value={projectDescription}
          onChange={onChangeProjectDescription}
          slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX_LEN } }}
          required
        />

      {submitError && (
        <Alert severity="error">
          {submitError}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
        <Button type="button" onClick={onDismiss} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} variant="contained">
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Box>
  );
};

export default NewProjectForm;
