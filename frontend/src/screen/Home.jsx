import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isMoadlOpen, setIsMoadlOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  useEffect(() => {
    axios.get("/project/all").then((res) => {
      setProject(res.data.projects);
    });
  }, []);

  const createProject = (e) => {
    e.preventDefault();

    console.log(`Bearer ${localStorage.getItem("token")}`);

    axios
      .put("/project/create", {
        name: projectName,
      })
      .then((res) => {
        console.log("Project created successfully:", res.data);
        setIsMoadlOpen(false);
        setProjectName("");
      })
      .catch((err) => {
        console.error("Error creating project:", err);
      });
  };
  return (
    <main className="p-4 ">
      <div className="projects flex flex-wrap gap-3  ">
        <div
          className=" project p-4 border border-slate-200 rounded-md w-fit cursor-pointer"
          onClick={() => {
            setIsMoadlOpen(true);
          }}
        >
          New Project
          <i className="ri-link  ml-2"></i>
        </div>
        {project.map((item, i) => {
          return (
            <div
              className="project flex flex-col gap-2 p-4 border border-slate-200 rounded-md  cursor-pointer min-w-52 hover:bg-slate-100"
              key={i}
              onClick={() => {
                navigate(`/project/`, {
                  state: { item },
                });
              }}
            >
              <h2 className="font-semibold">{item.name}</h2>
              <div className="flex gap-2">
                <i className="ri-user-line"></i>
                {item.users.length}
              </div>
            </div>
          );
        })}
      </div>

      <div className="">
        {isMoadlOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <form
                onSubmit={
                  createProject
                  // handle form submission here
                }
              >
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setIsMoadlOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
