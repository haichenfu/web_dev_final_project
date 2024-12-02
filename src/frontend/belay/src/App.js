import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// bootstrap import 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChannelPage from "./pages/ChannelPage";
import ThreadPage from "./pages/ThreadPage";

const PrivateRoute = ({ element: Component}) => {
  const location = useLocation();
  const apiKey = localStorage.getItem("haichenfu_api_key");

  if (!apiKey) {
    return <Navigate to="/login" state= {{ from: location }} />;
  }
  return Component;
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route
          path="/profile"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route
          path="/channel/:channelId"
          element={<PrivateRoute element={<ChannelPage />} />}
        />
        <Route
          path="/thread/:channelId/:messageId"
          element={<PrivateRoute element={<ThreadPage />} />}
        />
      </Routes>
    </Router>
  )
}

export default App;
