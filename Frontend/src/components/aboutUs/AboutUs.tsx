import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Container, Paper, Stack, Typography } from "@mui/material";

export default function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(240,249,255,0.9) 100%)" }}>
        <Stack spacing={2.5} sx={{ alignItems: "flex-start" }}>
          <InsightsRoundedIcon color="primary" sx={{ fontSize: 42 }} />
          <Typography variant="h3" color="primary.main">About Us</Typography>
          <Typography variant="h6" color="text.secondary">
            We are building a project workspace that stays focused on clarity: fewer distractions, faster board interactions, and a cleaner handoff between planning and delivery.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tboard is designed for teams that need a simple dashboard, structured project cards, and a drag-and-drop task board that feels fast enough to use every day.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}