import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setuser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Email:", email, "Password:", password);
    // Navigate to the home page after login

    axios
      .post("/users/register", { email, password })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setuser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-white">
            Welcome Back!
          </h2>
          <p className="text-sm text-center text-gray-400">
            Please login to your account
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:underline hover:text-purple-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
