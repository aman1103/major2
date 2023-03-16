//@ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/inter";
import { createTheme, ThemeProvider, Box } from "@mui/material";
import ButtonAppBar from "./Components/ButtonAppBar";
const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ButtonAppBar />
        <Box sx={{ m: 5 }}>
          <App />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
