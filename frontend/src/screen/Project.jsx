import axios from "../config/axios.js";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  initializeSocket,
  sendMessage,
  recieveMessage,
} from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";

const Project = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const messageBox = React.createRef();

  const { user } = useContext(UserContext);

  const location = useLocation();
  const [project, setProject] = useState(location.state.item);

  //console.log(location.state.item._id);

  // const sendMes = () => {
  //   socket.emit("send_message", {
  //     message: "hihi",
  //   });
  // };

  useEffect(() => {
    console.log("connect");
    initializeSocket(location.state.item._id);

    recieveMessage("project-message", (data) => {
      console.log(data);
      appendIncomingMessage(data);
    });

    axios.get(`/project/get-project/${location.state.item._id}`).then((res) => {
      setProject(res.data.project);
      // sendMes();
    });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [location.state.item._id]);

  // Toggle user selection
  const handleUserClick = (id) => {
    setSelectedUserIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((uid) => uid !== id) // Remove the id if it exists
          : [...prev, id] // Add the id if it doesn't exist
    );
  };

  const addCollab = async () => {
    axios
      .put("/project/add-user", {
        projectId: location.state.item._id,
        users: selectedUserIds,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e));
    setIsModalOpen(false);
  };

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user._id,
    });
    //appendIncomingMessage({ message, sender: "You" });
    setMessage("");
  };

  function appendIncomingMessage(messageObject) {
    const messageBox = document.querySelector(".message-box");
    const message = document.createElement("div");
    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-500"
    );
    message.innerHTML = `<small class='opacity-65 text-sx'>${messageObject.sender}</small>
    <p class='text-sm' >${messageObject.message}</p>
    `;
    messageBox.appendChild(message);
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex justify-between p-2 px-4 w-full bg-slate-100">
          <button
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill mr-1 " />
            <p>Add Collaborators</p>
          </button>
          <button
            onClick={() => {
              setIsSidePanelOpen(!isSidePanelOpen);
            }}
            className="p-2 cursor-pointer "
          >
            <i className="ri-group-fill " />
          </button>
        </header>
        <div className="conversation-area flex-grow flex flex-col">
          <div
            className="message-box p-1 flex-grow flex flex-col gap-1  "
            ref={messageBox}
          >
            <div className=" message max-w-64 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@hi.com</small>
              <p className="text-sm ">
                Hello hkjhkashdkjashdkjashdkjsahdkjshakdjas
                kjhkashdkjashdkjashdkjsahdkjshakdja
              </p>
            </div>
            <div className=" ml-auto max-w-64 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@hi.com</small>
              <p className="text-sm">Hello</p>
            </div>
          </div>
          <div className="inputFeild w-full flex">
            <input
              className="p-2 px-4 border-none outline-none flex-grow bg-white"
              type="text"
              placeholder="Enter the message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button
              onClick={send}
              className="  cursor-pointer px-5 bg-slate-950 text-white "
            >
              <i className="ri-send-plane-fill " />
            </button>
          </div>
        </div>
        {/* Modal for users */}
        {isModalOpen && (
          <div className="fixed inset-0  flex items-center justify-center  bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Select Users
              </h2>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer font-bold transition ${
                      selectedUserIds.includes(user._id)
                        ? "bg-black text-white "
                        : "bg-gray-100 hover:bg-blue-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold">
                      {user.email[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    {selectedUserIds.includes(user.id) && (
                      <i className="ri-check-line ml-auto text-2xl"></i>
                    )}
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => {
                  addCollab();

                  console.log(selectedUserIds);
                }}
              >
                Add Collaborators
              </button>
            </div>
          </div>
        )}
        <div
          className={`sidepanel transition-all flex flex-col gap-2 w-full h-full bg-slate-50  absolute  top-0 ${
            isSidePanelOpen ? "translate-x-0 " : "-translate-x-full"
          } `}
        >
          <header className="flex justify-between items-center p-4 px-4 bg-slate-300">
            <h1 className="font-bold text-lg">Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
              <i className="ri-close-fill text-2xl hover:cursor-pointer" />
            </button>
          </header>
          <div className="users flex flex-col gap-2 ">
            {project.users &&
              project.users.map((user) => {
                return (
                  <div className="user flex gap-2 cursor-pointer hover:bg-slate-200 p-2 items-center">
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                      <i className="ri-user-fill absolute  " />
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;
