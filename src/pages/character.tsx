import { AppBar, Box, CardMedia } from "@mui/material";
import React, { useEffect } from "react";
import useAvatarImage from "../apis/avatarImage";
import useStyle, { COLORS } from "./styles";
import { Canvas } from "@react-three/fiber";
import { Doggo } from "../components/ThreeJS/Doggo07";
import ResponsiveAppBar from "../components/Layout/Header";
import ResponsiveGrid from "../components/Layout/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { datadogRum } from "@datadog/browser-rum";
import { useNavigate } from "react-router-dom";

const Character: React.FC = () => {
  const { storedImage } = useAvatarImage();
  const navigate = useNavigate();
  const { boxWidth } = useStyle();
  const [activeVoice, setActiveVoice] = React.useState({
    languageCodes: ["en-US"],
    name: "en-US-Standard-C",
    ssmlGender: "FEMALE",
    naturalSampleRateHertz: 24000,
    code: "English-Female",
  });

  // useEffect(() => {
  //   let voice = sessionStorage.getItem("voice");
  //   if (voice) {
  //     setActiveVoice(JSON.parse(voice));
  //   } else {
  //     setActiveVoice({
  //       languageCodes: ["en-US"],
  //       name: "en-US-Standard-A",
  //       ssmlGender: "FEMALE",
  //       naturalSampleRateHertz: 24000,
  //       code: "English-Female",
  //     });
  //   }
  // }, []);

  const Voices = [
    {
      languageCodes: ["en-US"],
      name: "en-US-Standard-C",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "English-Female",
    },
    {
      languageCodes: ["en-US"],
      name: "en-US-Standard-B",
      ssmlGender: "MALE",
      naturalSampleRateHertz: 24000,
      code: "English-Male",
    },
    {
      languageCodes: ["hi-IN"],
      name: "hi-IN-Wavenet-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Hindi-Female",
    },
    {
      languageCodes: ["bn-IN"],
      name: "bn-IN-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Bangla-Female",
    },
    {
      languageCodes: ["fil-PH"],
      name: "fil-PH-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Filipino Female",
    },
    {
      languageCodes: ["es-ES"],
      name: "es-ES-Neural2-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Spanish Female",
    },
  ];

  const setVoice = (voice: any) => {
    for (let i of Voices) {
      if (i.code === voice) {
        setActiveVoice(i);
        sessionStorage.setItem("voice", JSON.stringify(i));
      }
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  const turnAudio = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  };

  useEffect(() => {
    const user = localStorage.getItem("id");
    if (!user) {
      navigate("/");
    } else {
      datadogRum.setUser({
        id: localStorage.getItem("email"),
        name: localStorage.getItem("email"),
        email: localStorage.getItem("email"),
      });
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <ResponsiveAppBar />
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingLeft: "5vh",
          paddingRight: "5vh",
          bgcolor: COLORS.bgcolor,
        }}
      >
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ width: boxWidth, alignSelf: "center" }}
        >
          <Box sx={{ minWidth: 120, marginTop: 2, marginBottom: 2 }}>
            {activeVoice ? (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Language</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  onChange={(e) => setVoice(e.target.value)}
                  value={activeVoice.code}
                >
                  {Voices.map((voice, index) => (
                    <MenuItem value={voice.code} key={index}>
                      {voice.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
          </Box>
        </AppBar>

        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            component="div"
            className="shadow-box"
            sx={{
              width: boxWidth,
              height: "40vh",
              boxSizing: "border-box",
              overflow: "hidden",
              margin: "0 0 2vh 0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Canvas
              camera={{
                fov: 45,
                rotation: [0, 0, 0],
                position: [0, 0, 10],
              }}
              style={{ backgroundColor: "#FAD972" }}
            >
              <pointLight position={[0, 0, 10]} intensity={0.03} />
              <Doggo></Doggo>
            </Canvas>
          </Box>

          <Box
            component="div"
            sx={{
              width: boxWidth,
              textAlign: "left",
              boxSizing: "content-box",
              overflow: "hidden",
            }}
          ></Box>

          {/* <Box
            component="div"
            className="shadow-box"
            sx={{
              width: boxWidth,
              height: "15vh",
              verticalAlign: "middle",
              boxSizing: "content-box",
              margin: "2vh 0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography
              style={{ color: COLORS.primary }}
              sx={{
                padding: "0.8vh",
                margin: "1.2vh",
                textAlign: "left",
                height: "11vh",
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                  width: "1.5px",
                  height: "0",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#AAA",
                  borderRadius: "0.7px",
                },
                borderRadius: "4vh",
                fontFamily: "Google Sans, sans-serif",
                fontSize: "14px",
              }}
            >
              {transcript[1]}
            </Typography>
          </Box> */}

          {/* <Box
            component="div"
            sx={{
              justifyContent: "center",
              paddingTop: "2vh",
              transform: "translate(15px, -30px)",
            }}
          >
            {characterStateIcon[characterState]}
            <Box
              component="div"
              className={`bar-container ${
                characterState != CharacterState.Listening ? "hidden" : ""
              }`}
            >
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[0] = el)}
                className="bar"
              />
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[1] = el)}
                className="bar middle"
              />
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[2] = el)}
                className="bar"
              />
            </Box>
          </Box> */}
        </Box>
        <ResponsiveGrid />
      </Box>
    </ThemeProvider>
  );
};

export default Character;
