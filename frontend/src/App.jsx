import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import Chat from "./Components/Chat.jsx";
import store from "./slices/index.js";
//
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There is nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
