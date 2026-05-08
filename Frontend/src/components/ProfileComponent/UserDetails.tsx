import { useRef, useState } from "react";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { getUserInitials } from "../../utils/initials";

export default function UserDetails() {
  const { name, initials } = useAuth();

  // Dummy data – replace with API call when ready
  const email = "user@example.com";
  const joinDate = "January 2023";
  const isPro = true;

  const [avatarSrc, setAvatarSrc] = useState<string>("https://picsum.photos/200");
  const [displayName, setDisplayName] = useState<string>(name ?? "");
  const [location, setLocation] = useState("Noida, India");
  const [role, setRole] = useState("Associate Software Engineer");

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const [draftLocation, setDraftLocation] = useState(location);
  const [draftRole, setDraftRole] = useState(role);
  const [draftAvatarSrc, setDraftAvatarSrc] = useState(avatarSrc);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setDraftName(displayName);
    setDraftLocation(location);
    setDraftRole(role);
    setDraftAvatarSrc(avatarSrc);
    setIsEditing(true);
  };

  const handleSave = () => {
    setDisplayName(draftName.trim() || displayName);
    setLocation(draftLocation);
    setRole(draftRole);
    setAvatarSrc(draftAvatarSrc);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setDraftAvatarSrc(objectUrl);
    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const activeAvatar = isEditing ? draftAvatarSrc : avatarSrc;
  const activeName = isEditing ? draftName : displayName;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
        }}
      >
        {/* ── Gradient header ── */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 4,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #14b8a6 100%)",
            color: "common.white",
            position: "relative",
          }}
        >
          {/* Edit / Save / Cancel toggle */}
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            {isEditing ? (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Save changes">
                  <IconButton size="small" onClick={handleSave} sx={{ color: "common.white" }}>
                    <SaveOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton size="small" onClick={handleCancel} sx={{ color: "rgba(255,255,255,0.7)" }}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Tooltip title="Edit profile">
                <IconButton size="small" onClick={handleEdit} sx={{ color: "rgba(255,255,255,0.78)" }}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
            {/* Avatar with upload overlay */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                src={activeAvatar}
                alt={activeName || "user"}
                sx={{ width: 80, height: 80, border: "3px solid rgba(255,255,255,0.30)" }}
              >
                {!activeAvatar ? getUserInitials(activeName) : initials}
              </Avatar>
              {isEditing && (
                <>
                  <Tooltip title="Upload photo">
                    <Box
                      component="label"
                      htmlFor="avatar-upload"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.45)",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.60)" },
                      }}
                    >
                      <AddAPhotoOutlinedIcon sx={{ color: "common.white", fontSize: 22 }} />
                    </Box>
                  </Tooltip>
                  <input
                    ref={fileInputRef}
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarFileChange}
                  />
                </>
              )}
            </Box>

            {/* Name + email + chip */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              {isEditing ? (
                <TextField
                  variant="outlined"
                  size="small"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Display name"
                  slotProps={{ htmlInput: { maxLength: 60 } }}
                  sx={{
                    mb: 0.75,
                    "& .MuiOutlinedInput-root": {
                      color: "common.white",
                      bgcolor: "rgba(255,255,255,0.12)",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                      "&.Mui-focused fieldset": { borderColor: "common.white" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  }}
                />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {displayName || name || "—"}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.25 }}>
                {email}
              </Typography>
              {isPro && (
                <Chip
                  label="PRO"
                  size="small"
                  sx={{ mt: 0.75, bgcolor: "rgba(255,255,255,0.16)", color: "common.white" }}
                />
              )}
            </Box>
          </Stack>
        </Box>

        {/* ── Details body ── */}
        <Stack divider={<Divider />}>
          {/* Info rows */}
          <Stack spacing={2.5} sx={{ px: 3, py: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.12em" }}>
              Profile Info
            </Typography>

            {/* Member since – always read-only */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CalendarMonthRoundedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                Member since
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {joinDate}
              </Typography>
            </Stack>

            {/* Location */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: isEditing ? "flex-start" : "center" }}>
              <PlaceOutlinedIcon fontSize="small" color="action" sx={{ mt: isEditing ? 1 : 0 }} />
              {isEditing ? (
                <TextField
                  size="small"
                  fullWidth
                  label="Location"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value)}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {location}
                  </Typography>
                </>
              )}
            </Stack>

            {/* Role */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: isEditing ? "flex-start" : "center" }}>
              <WorkOutlineRoundedIcon fontSize="small" color="action" sx={{ mt: isEditing ? 1 : 0 }} />
              {isEditing ? (
                <TextField
                  size="small"
                  fullWidth
                  label="Role"
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value)}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                    Role
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {role}
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>

          {/* Stats row */}
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ px: 3, py: 2.5 }}
          >
            <Stack sx={{ flex: 1, alignItems: "center" }} spacing={0.5}>
              <AssignmentOutlinedIcon color="primary" />
              <Typography variant="h6">12</Typography>
              <Typography variant="caption" color="text.secondary">
                Projects
              </Typography>
            </Stack>
            <Stack sx={{ flex: 1, alignItems: "center" }} spacing={0.5}>
              <CheckCircleOutlineRoundedIcon color="secondary" />
              <Typography variant="h6">48</Typography>
              <Typography variant="caption" color="text.secondary">
                Tasks Done
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}