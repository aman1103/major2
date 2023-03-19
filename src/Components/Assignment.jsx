//@ts-nocheck
import {
  Typography,
  Button,
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  Checkbox,
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
  const [file, setFile] = useState();
  const [submissionId, setSubmissionId] = useState();
  const [data, setData] = useState();
  const [sortedData, setSortedData] = useState();
  const [sort, setSort] = useState(false);

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
    if (file === undefined) {
      return;
    }
    console.log(file);
    const formData = new FormData();
    formData.append("language", language);
    formData.append("code", file);
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="file"
            variant="standard"
            onChange={(e) => setFile(e.target.files[0])}
            autoComplete="off"
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
        >
          Refresh
        </Button>
      )}
      {kind === "rec" && data && !sort && <EnhancedTable data={data} />}
      {kind === "rec" && sortedData && sort && (
        <EnhancedTable data={sortedData} />
      )}
    </>
  );
};

export default Assignment;
