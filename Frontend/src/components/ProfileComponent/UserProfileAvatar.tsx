import { useState, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import UserActionPopover from "./UserActionPopover";
import { Avatar, Box, IconButton, Popover } from "@mui/material";

type Props = {
    onLogout: () => void;
}

export default function UserProfileAvatar({ onLogout }: Props) {

    const { name, initials } = useAuth();

    // Dummy user details for profile component
    const email = "user@example.com";
    const userAvatarUrl = "https://picsum.photos/200";
    const joinDate = "January 2023";
    const location = "Noida, India";
    const role = "Associate Software Engineer";

    // const navigate = useNavigate();

    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const profileDetailsRef = useRef<HTMLDivElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <Box ref={profileDetailsRef}>
            <IconButton
                onClick={(event) => {
                    setShowProfileDetails((prev) => !prev);
                    setAnchorEl(event.currentTarget);
                }}
                aria-label="User avatar"
                title={name ?? ""}
                sx={{ p: 0.3 }}
            >
                <Avatar
                    src={userAvatarUrl}
                    alt={name ?? "user name"}
                    sx={{
                        width: 46,
                        height: 46,
                        bgcolor: "secondary.main",
                        color: "common.white",
                        border: "2px solid rgba(255,255,255,0.24)",
                    }}
                >
                    {!userAvatarUrl ? initials : null}
                </Avatar>
            </IconButton>
            <Popover
                open={showProfileDetails}
                onClose={() => {
                    setShowProfileDetails(false);
                    setAnchorEl(null);
                }}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { mt: 2, borderRadius: 3, overflow: "visible", boxShadow: "0 24px 48px rgba(15,23,42,0.16)" } } }}
            >
                <UserActionPopover setShowProfileDetails={setShowProfileDetails} userInfo={{ email, joinDate, location, role, userAvatarUrl }} onLogout={onLogout} />
            </Popover>
        </Box>
    )
}