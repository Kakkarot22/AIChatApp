import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../screen/login";
import Register from "../screen/Register";
import Home from "../screen/Home";
import Project from "../screen/Project";
import Userauth from "../auth/Userauth";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Userauth>
              {" "}
              <Home />
            </Userauth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/project"
          element={
            <Userauth>
              {" "}
              <Project />
            </Userauth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
