//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogContentText,
  TextField,
  DialogActions,
  Link,
} from "@mui/material";

const Assignments = () => {
  // Variables
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [languages, setLanguages] = useState();
  const [deadline, setDeadline] = useState();

  //Initial Load Function
  const fetchAssignments = async () => {
    if (localStorage.getItem("kind") !== "rec") {
      localStorage.clear();
      navigate("/");
    }
    const access_token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/assignments", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = res.data;
      setAssignments(data.assignments);
      setLoading(false);
    } catch (e) {
      if (e.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
      console.error(e);
    }
  };

  //Effect on Load
  useEffect(() => {
    fetchAssignments();
  }, []);

  //Other useful functions
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const goToAssignment = (id) => {
    navigate(`/assignments/${id}`);
  };

  const handleCreation = async () => {
    const sendThis = {
      title: title,
      language: languages,
      content: content,
      deadline: deadline,
      recruiter_id: localStorage.getItem("id"),
    };
    console.log(sendThis);
    try {
      await axios.post("http://localhost:5000/assignments/new", sendThis, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <Typography variant="h3">Create Assignment</Typography>
        <br />
        <Button variant="contained" onClick={handleClickOpen}>
          Create New Assignment
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>New Assignment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label="Content"
              type="text"
              fullWidth
              variant="standard"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label="Language(s)"
              type="text"
              fullWidth
              variant="standard"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              helperText="Deadline"
              type="date"
              fullWidth
              variant="standard"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreation}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
      <br />
      <br />
      {loading && <h2>Loading</h2>}
      {assignments?.map((assignment, index) => {
        return (
          <>
            <Typography
              variant="h4"
              key={assignment.id}
              display="block"
              gutterBottom
            >
              {index + 1}.{" "}
              <Link
                onClick={() => {
                  goToAssignment(assignment.id);
                }}
              >
                {assignment.title}
              </Link>
            </Typography>
            <br />
          </>
        );
      })}
    </>
  );
};

export default Assignments;
