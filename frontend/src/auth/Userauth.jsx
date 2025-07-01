import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const Userauth = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (!user) {
      navigate("/login");
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};

export default Userauth;
