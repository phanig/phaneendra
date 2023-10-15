import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Invite() {
  const { token } = useParams();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setMsg("You don't have access to this page");
      return;
    } else {
      localStorage.setItem("org_token", token);
      window.location.href = "/";
    }
  }, [token]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h4">
            AvatarX
          </Typography>
          <Typography component="h2" variant="h5">
            {msg}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
