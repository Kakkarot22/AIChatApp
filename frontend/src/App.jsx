import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { UserProvier } from "./context/user.context";

const App = () => {
  return (
    <div>
      <UserProvier>
        <AppRoutes />
      </UserProvier>
    </div>
  );
};

export default App;
