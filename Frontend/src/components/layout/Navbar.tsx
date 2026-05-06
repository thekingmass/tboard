import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuItemLink from "../shared/MenuItemLink";
import UserProfileInfo from "../ProfileComponent/UserProfileInfo";
import { useAuth } from "../../auth/AuthContext";

type Props = {
    onLogout: () => void;
}

export default function Navbar({ onLogout }: Props) {

  const {isLoggedIn} = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        color="transparent"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(29,78,216,0.92) 48%, rgba(14,165,233,0.86) 100%)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: 72, md: 84 }, gap: 2, justifyContent: "space-between" }}>
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              sx={{
                gap: 1.5,
                px: 0.5,
                minWidth: 0,
                textTransform: "none",
                borderRadius: 3,
              }}
            >
              <GroupRoundedIcon sx={{ fontSize: 34, color: "common.white" }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: "common.white" }}>
                tboard
              </Typography>
            </Button>

            <Stack
              direction="row"
              spacing={{ xs: 0.5, md: 1 }}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {isLoggedIn && (
                <MenuItemLink to="/projects" icon={<DashboardRoundedIcon fontSize="small" />}>
                Dashboard
              </MenuItemLink>
              )}
              
              <MenuItemLink to="/aboutus" icon={<InfoOutlinedIcon fontSize="small" />}>
                About Us
              </MenuItemLink>
              <MenuItemLink to="/contactus" icon={<MailOutlineRoundedIcon fontSize="small" />}>
                Contact Us
              </MenuItemLink>
            </Stack>
            {isLoggedIn ? ( <UserProfileInfo onLogout={onLogout} /> ) : (
              <MenuItemLink to="/login" icon={<LoginRoundedIcon fontSize="small" />}>
                Login
              </MenuItemLink>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}