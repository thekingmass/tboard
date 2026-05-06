import React, { useState } from "react";
import InputBox from "../sharedComponents/InputBox";
import NewProjectButton from "../sharedComponents/NewProjectButton";
import Modal from "../sharedComponents/Modal";
import NewProjectForm from "../sharedComponents/NewProjectForm";
import { Paper, Stack } from "@mui/material";


type TopControlProps = {
  onSearch: (searchText: string) => void;
  onCreated?: () => void;
};

const TopControl: React.FC<TopControlProps> = ({ onSearch, onCreated }) => {
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  }

  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 3, bgcolor: "rgba(255,255,255,0.72)", border: "1px solid rgba(148,163,184,0.18)" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <InputBox placeholder="Search across projects" onChange={handleInputChange} />

      {/* Modal with hardCode data as of now */}
        <NewProjectButton onClick={() => setModalOpen(true)} />
      </Stack>

      {/* Model to Create a new Project */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Project"
      >
        <NewProjectForm
          onDismiss={() => setModalOpen(false)}
          onCreated={onCreated}
        />
      </Modal>
    </Paper>
  );
};

export default TopControl;
