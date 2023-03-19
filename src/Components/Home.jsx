import { Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const doThisFirst = () => {
    if (localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  useEffect(() => {
    doThisFirst();
  }, []);

  return (
    <>
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h3">
          Autograder : Automatically Grades Assignments
        </Typography>
        <br />
        <Typography variant="body1" sx={{}}>
          The project was developed to address the issue faced by recruiters who
          struggle to assess programming assignments due to the large number of
          applications received and a lack of technical knowledge or expertise
          to evaluate them individually.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
