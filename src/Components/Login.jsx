//@ts-nocheck
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  MenuItem,
} from "@mui/material";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Login = () => {
  const navigate = useNavigate();
  const user = [
    {
      value: true,
      label: "Recruiter",
    },
    {
      value: false,
      label: "Candidate",
    },
  ];

  //Email Variables
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  //Password Variables
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  //Recruiter Variabless
  const [isRecruiter, setIsRecruiter] = useState(false);

  //Error Messages Variables
  const [errMsg, setErrMsg] = useState("");

  //Validating Email
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    // console.log(result);
    // console.log(email);
    setValidEmail(result);
    if (result === false) {
      setErrMsg("Not a valid email");
    } else {
      setErrMsg("");
    }
  }, [email]);

  //Validating Passowrd
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    // console.log(result);
    // console.log(password);
    setValidPassword(result);
    if (result === false) {
      setErrMsg(
        "Password must contain an uppercase, lowercase and a special character and must be between 8-24 characters long"
      );
    } else {
      setErrMsg("");
    }
  }, [password]);
  useEffect(() => {
    setErrMsg("");
    if (localStorage.getItem("token")) {
      const isRecruiter = localStorage.getItem("kind") === "rec";
      console.log(isRecruiter);
      if (isRecruiter) {
        navigate("/assignments");
      } else {
        navigate("/candidate");
      }
    }
  }, []);

  // Handling login click
  const handleLogin = async () => {
    setErrMsg("");
    const kind = isRecruiter === true ? "rec" : "can";
    const user = {
      email: email,
      password: password,
      kind: kind,
    };
    try {
      const response = await axios.post("http://localhost:5000/login", user);
      const data = response.data;
      console.log(data);
      localStorage.setItem("email", user.email);
      localStorage.setItem("kind", kind);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("id", data.id);
      if (isRecruiter) {
        navigate("/assignments");
      } else {
        navigate("/candidate");
      }
    } catch (err) {
      setErrMsg(err.response.data.msg);
    }
  };

  const handleRedirection = () => {
    navigate({
      pathname: "/register",
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2} sx={{ maxWidth: "500px" }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" gutterBottom>
              Login
            </Typography>
          </Grid>
          {errMsg !== "" && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Alert severity="error">
                <p>{errMsg}</p>
              </Alert>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              sx={{ display: "block", margin: "0 auto" }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              required
              type="text"
              autoComplete="off"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              id="outlined-select-currency"
              select
              label="Kind" //"Recruiter/Candidate"
              value={isRecruiter}
              onChange={(e) => setIsRecruiter(e.target.value)}
            >
              {user.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              disabled={!validEmail || !validPassword ? true : false}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6"> Don't have an account?</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{ marginBottom: "10px" }}
              variant="contained"
              onClick={handleRedirection}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Login;
