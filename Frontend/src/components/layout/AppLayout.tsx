import { Box, Container } from "@mui/material";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, md: 2.5 },
        py: { xs: 1.5, md: 2.5 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: "0 !important" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default AppLayout;
