import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Travels from "./pages/Travels";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Show Navbar only if user is logged in */}
        {localStorage.getItem("token") && <Navbar />}

        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Employee routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Travels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
