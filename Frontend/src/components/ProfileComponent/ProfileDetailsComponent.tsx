import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { Avatar, Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";

interface ProfileDetailsComponentProps {
  setShowProfileDetails: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: {
    email: string;
    joinDate: string;
    location: string;
    role: string;
    userAvatarUrl: string;
  },
    onLogout: () => void;
}

// will implement a getProfileDetails api call later to fetch user details

const ProfileDetailsComponent: React.FC<ProfileDetailsComponentProps> = ({ setShowProfileDetails, userInfo, onLogout }) => {

  const navigate = useNavigate();

  const { name, initials } = useAuth();
  const userAvatarUrl = userInfo.userAvatarUrl;
  const isPro = true;
  const email = userInfo.email;
  const joinDate = userInfo.joinDate;
  const location = userInfo.location;
  const role = userInfo.role;

  return (
    <Box sx={{ width: 320, overflow: "hidden" }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #14b8a6 100%)",
          color: "common.white",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar src={userAvatarUrl} alt={name ?? "user"} sx={{ width: 58, height: 58 }}>
            {!userAvatarUrl ? initials : null}
          </Avatar>
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)" }}>{email}</Typography>
            {isPro ? <Chip label="PRO" size="small" sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.16)", color: "common.white" }} /> : null}
          </Box>
        </Stack>
      </Box>

      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Button startIcon={<DashboardRoundedIcon />} onClick={() => { navigate("/projects"); setShowProfileDetails(false); }}>
            Dashboard
          </Button>
          <Button startIcon={<HomeOutlinedIcon />} onClick={() => { navigate("/"); setShowProfileDetails(false); }}>
            Home
          </Button>
          <Button startIcon={<EditOutlinedIcon />} color="inherit">
            Edit Profile
          </Button>
          <Button startIcon={<LogoutRoundedIcon />} color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Stack>

        <Divider />

        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarMonthRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2">Member since {joinDate}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <PlaceOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2">{location}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <WorkOutlineRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2">{role}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfileDetailsComponent;
