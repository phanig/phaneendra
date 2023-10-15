import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "../components/Layout/Loader";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = window.location.search;
  const params = new URLSearchParams(search);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse.access_token),
    onError: (error: any) => console.log("Login Failed:", error),
  });

  const saveUserProfile = (data: any, token: any, id: any) => {
    axios
      .patch(`https://api.avatarx.live/api/whitelisted-emails/${id}/`, {
        img_url: data.picture,
        name: data.name,
        social_token: token,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/talk");
      })
      .catch((err) => console.log(err));
  };

  const loginUser = (email: any, data: any, token: any) => {
    axios
      .post(`https://api.avatarx.live/api/login/`, {
        email: email,
        token: localStorage.getItem("org_token") || null,
      })
      .then((res) => {
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("name", res.data.name);
        saveUserProfile(data, token, res.data.id);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user}`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("name", res.data.name);
          loginUser(res.data.email, res.data, user);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const validateToken = (token: string, email: string) => {
    setLoading(true);
    axios
      .post(`https://api.avatarx.live/api/verify-token/`, {
        token: token,
        email: email,
      })
      .then((res) => {
        let data = res.data;
        localStorage.setItem("id", data.id);
        localStorage.setItem("email", data.email);
        navigate("/talk");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const user = localStorage.getItem("id");
    const token = params.get("token");
    const email = params.get("email");
    if (user) {
      navigate("/talk");
    } else {
      if (token && email) {
        validateToken(token, email);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {loading ? <CircularIndeterminate /> : null}
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
            Sign in
          </Typography>
          <br />
          <br />
          <Box component="form" noValidate sx={{ mt: 4 }}>
            <GoogleButton onClick={() => login()} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
