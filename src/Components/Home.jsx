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

  return <>Hi</>;
};

export default Home;
