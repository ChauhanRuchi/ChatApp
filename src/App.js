import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes and Route
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/Navbar";
import Register from "./pages/RegisterPage";
import { AuthContext, } from "./context/AuthContext";
import { ChatContext, ChatContextProvider } from "./context/ChatContext";
import Chats from "./pages/Chats";
import { UserFetchStatus } from "./hooks/useFetchStatus";

function App() {
  const { user } = useContext(AuthContext);

  const data = UserFetchStatus();

  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        <Container>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={user ? <Chats /> : <Register />} />
            </Routes>
          </Router>
        </Container>
      </ChatContextProvider>
    </>
  );
}

export default App;
