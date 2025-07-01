import React, { useState, useContext, createContext } from "react";

export const UserContext = createContext();

export const UserProvier = ({ children }) => {
  const [user, setuser] = useState("");
  return (
    <UserContext.Provider value={{ user, setuser }}>
      {children}
    </UserContext.Provider>
  );
};
