import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HomePageOurServiceCard from "./HomePageOurServiceCard";
import { ourServicesData } from "../../staticData/ourServiceData";

export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #14b8a6 100%)",
          color: "common.white",
        }}
      >
        <Stack spacing={5}>
          <Stack spacing={2} sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <GroupRoundedIcon sx={{ width: 76, height: 76 }} />
              <Typography variant="h1">Tboard</Typography>
            </Stack>
            <Typography variant="h2">Plan projects, move tasks, and keep every lane aligned.</Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.82)", maxWidth: 620 }}>
              A focused workspace for teams that want a clear project dashboard, a fast drag-and-drop board, and a cleaner flow from idea to delivery.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button component={Link} to="/projects" size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ minHeight: 58 }}>
                Open your board
              </Button>
              <Button component={Link} to="/aboutus" size="large" variant="outlined" color="inherit" sx={{ minHeight: 58, borderColor: "rgba(255,255,255,0.3)" }}>
                Learn more
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {ourServicesData.slice(0, 3).map((item) => (
              <HomePageOurServiceCard key={item.title} title={item.title} description={item.description} />
            ))}
          </Box>
        </Stack>
      </Paper>
    </Container>
  )
}