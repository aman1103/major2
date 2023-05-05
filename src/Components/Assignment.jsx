//@ts-nocheck
import {
  Typography,
  Button,
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  Checkbox,
  Dialog,
  Snackbar,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EnhancedTable from "./Table";

const Assignment = () => {
  const [kind, setKind] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  // const [file, setFile] = useState();
  const [fileLink, setFileLink] = useState("");
  const [submissionId, setSubmissionId] = useState();
  const [data, setData] = useState();
  const [sortedData, setSortedData] = useState();
  const [sort, setSort] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [emailNumberX, setEmailNumberX] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleFailToastClose = () => {
    setFailToastOpen(false);
  };

  const handleEmailSend = async () => {
    if (emailNumberX <= 0) {
      return;
    }
    setOpen(false);
    let numberOfEmailsToSend = new FormData();
    numberOfEmailsToSend.append("x", emailNumberX);
    console.log(numberOfEmailsToSend);
    try {
      // Use = cmd.exe /C start http://localhost:8025 to open this in host comp
      await axios.post(
        `http://localhost:5000/assignments/${params.assignmentId}/submissions/email`,
        numberOfEmailsToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setToastOpen(true);
    } catch (e) {
      setFailToastOpen(true);
      console.log(e);
    }
  };

  const checkUser = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    if (localStorage.getItem("kind") === "rec") {
      setKind("rec");
    } else {
      setKind("can");
    }
    try {
      // console.log(params.assignmentId);
      const res = await axios.get(
        `http://localhost:5000/assignments/${params.assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = res.data;
      setTitle(data.title);
      setLanguage(data.language);
      setContent(data.content);
      setDeadline(data.deadline);
      setLoading(false);
    } catch (e) {
      if (e.response?.status === 401) {
        alert("Session Expired");
        localStorage.clear();
        navigate("/login");
      } else {
        console.log(e);
      }
    }
  };

  const getAssignments = async () => {
    const res2 = await axios.get(
      `http://localhost:5000/assignments/${params.assignmentId}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const res3 = await axios.get(
      `http://localhost:5000/assignments/${params.assignmentId}/submissions/sort`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    let tempRow = [];
    let tempRow2 = [];
    res2.data.submissions.map((submission) => {
      axios.get(
        `http://localhost:5000/assignments/${params.assignmentId}/submissions/${submission.id}/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let sub = {
        name: submission.candidate_name,
        id: submission.id,
        email: submission.candidate_email,
        grade: submission.grade === null ? 0 : submission.grade,
        submittedTime: submission.submitted_at,
      };
      console.log(submission.grade);
      tempRow.push(sub);
    });
    res3.data.submissions.map((submission) => {
      let sub = {
        name: submission.candidate_name,
        id: submission.id,
        email: submission.candidate_email,
        grade: submission.grade === null ? 0 : submission.grade,
        submittedTime: submission.submitted_at,
      };
      console.log(submission.grade);
      tempRow2.push(sub);
    });
    setData(tempRow);
    setSortedData(tempRow2);
  };

  useEffect(() => {
    checkUser();
    if (localStorage.getItem("kind") === "rec") {
      getAssignments();
    }
  }, []);

  const handleSubmit = async () => {
    if (fileLink === "") {
      return;
    }
    console.log(fileLink);
    const formData = new FormData();
    formData.append("language", language);
    formData.append("repo", fileLink);
    console.log(formData);
    const res = await axios.post(
      `http://localhost:5000/assignments/${params.assignmentId}/submit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setSubmissionId(res.data.submission_id);
  };
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => navigate("/assignments")}
    >
      Assignments
    </Link>,
    <Typography key="3" color="text.primary">
      {params.assignmentId}
    </Typography>,
  ];

  return (
    <>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      {loading && <h2>Loading</h2>}
      <Typography variant="h3">{title}</Typography>
      <br />
      <Typography variant="h6">{content}</Typography>
      <br />
      <Typography variant="body1">Language(s) : {language}</Typography>
      <br />
      <Typography variant="body2">Deadline : {deadline}</Typography>
      <br />
      {kind === "can" && (
        <>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            type="file"
            variant="standard"
            onChange={(e) => setFile(e.target.files[0])}
            autoComplete="off"
          /> */}
          <TextField
            autoFocus
            label="Repository Link"
            margin="dense"
            id="name"
            type="text"
            autoComplete="off"
            value={fileLink}
            onChange={(e) => {
              setFileLink(e.target.value);
            }}
          />
          <br />
          <Button variant="contained" onClick={handleSubmit}>
            Submit Assignment
          </Button>
          <br />
        </>
      )}
      <br />
      {submissionId && (
        <>
          <Typography variant="h6">Submission Id : {submissionId}</Typography>
          <br />
          <Alert severity="success">Your submission has been received!!</Alert>
        </>
      )}
      {kind === "rec" && (
        <>
          <span>Sort by Grade</span>
          <Checkbox
            onChange={() => {
              setSort(!sort);
            }}
          />
        </>
      )}
      {kind === "rec" && (
        <Button
          variant="contained"
          onClick={() => {
            window.location.reload();
          }}
          sx={{ marginRight: "20px" }}
        >
          Refresh
        </Button>
      )}
      {kind === "rec" && (
        <>
          <Button variant="outlined" onClick={handleClickOpen}>
            Send Email
          </Button>
          <Dialog open={open} onClose={handleClose}>
            {/* <DialogTitle>Subscribe</DialogTitle> */}
            <DialogContent>
              <DialogContentText>
                Enter the numeber of students that you want to send email to and
                we will sent the top n amount of students,n being the number of
                students you want to send the email to
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Number"
                type="number"
                fullWidth
                autoComplete="off"
                variant="standard"
                value={emailNumberX}
                onChange={(e) => {
                  setEmailNumberX(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleEmailSend}>Send</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {kind === "rec" && data && !sort && <EnhancedTable data={data} />}
      {kind === "rec" && sortedData && sort && (
        <EnhancedTable data={sortedData} />
      )}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Email Sent Successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={failToastOpen}
        autoHideDuration={2000}
        onClose={handleFailToastClose}
      >
        <Alert
          onClose={handleFailToastClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to send email
        </Alert>
      </Snackbar>
    </>
  );
};

export default Assignment;
