import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import type { DialogProps } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "sm" }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={maxWidth}>
      {title ? (
        <DialogTitle sx={{ pr: 1.5}}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <span>{title}</span>
            <IconButton onClick={onClose} size="small">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>
      ) : null}
      <DialogContent sx={{overflow: "visible"}}>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;