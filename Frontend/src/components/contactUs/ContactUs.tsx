import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { Container, Link, Paper, Stack, Typography } from "@mui/material";

export default function ContactUs() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(236,253,245,0.92) 100%)" }}>
        <Stack spacing={2.5}>
          <MailOutlineRoundedIcon color="secondary" sx={{ fontSize: 42 }} />
          <Typography variant="h3" color="secondary.main">Contact Us</Typography>
          <Typography variant="h6" color="text.secondary">
            We would love to hear from you. Questions, feedback, and product ideas are all welcome.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Reach the team at <Link href="mailto:support@example.com" underline="hover">support@example.com</Link> and we will get back to you as soon as possible.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}