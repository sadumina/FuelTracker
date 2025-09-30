import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { People, DirectionsCar, BarChart, Dashboard } from "@mui/icons-material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Travels from "./Travels"; // ✅ Reuse user dashboard functions

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  // Load users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  // Load travel logs
  const fetchLogs = async () => {
    try {
      const res = await API.get("/travels/all");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  // Update role
  const updateRole = async (email, role) => {
    try {
      setLoading(true);
      await API.put(`/users/${email}`, { role });
      setSnackbar({
        open: true,
        message: `✅ Updated ${email} to ${role}`,
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || "Failed to update role",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      setLoading(true);
      await API.delete(`/users/${email}`);
      setSnackbar({
        open: true,
        message: `🗑️ Deleted ${email}`,
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || "Delete failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Analytics data
  const officialTotal = logs.reduce((sum, l) => sum + (l.official_km || 0), 0);
  const privateTotal = logs.reduce((sum, l) => sum + (l.private_km || 0), 0);
  const distanceByUser = users.map((u) => ({
    name: u.name,
    total: logs
      .filter((l) => l.user_email === u.email)
      .reduce((s, l) => s + (l.total_km || 0), 0),
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab icon={<People />} label="Users" />
        <Tab icon={<DirectionsCar />} label="Travel Logs" />
        <Tab icon={<BarChart />} label="Analytics" />
        <Tab icon={<Dashboard />} label="User Functions" /> {/* ✅ New tab */}
      </Tabs>

      {/* Users Tab */}
      <TabPanel value={tab} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Fuel Card</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.fuel_card_no}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        color={u.role === "admin" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {u.role !== "admin" && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => updateRole(u.email, "admin")}
                          disabled={loading}
                        >
                          Make Admin
                        </Button>
                      )}
                      {u.role !== "employee" && (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => updateRole(u.email, "employee")}
                          disabled={loading}
                        >
                          Make Employee
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteUser(u.email)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                      {/* ✅ View as User */}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/dashboard?user=${u.email}`)}
                      >
                        View Dashboard
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Travel Logs Tab */}
      <TabPanel value={tab} index={1}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Official KM</TableCell>
                  <TableCell>Private KM</TableCell>
                  <TableCell>Total KM</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{log.user_email}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.meter_start}</TableCell>
                    <TableCell>{log.meter_end}</TableCell>
                    <TableCell>{log.official_km}</TableCell>
                    <TableCell>{log.private_km}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${log.total_km} km`}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.remarks || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tab} index={2}>
        <Typography variant="h6" gutterBottom>
          Analytics Overview
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {/* Official vs Private Pie */}
          <ResponsiveContainer width="45%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Official KM", value: officialTotal },
                  { name: "Private KM", value: privateTotal },
                ]}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#4caf50" />
                <Cell fill="#f44336" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Distance by User Bar */}
          <ResponsiveContainer width="45%" height={300}>
            <RBarChart data={distanceByUser}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2196f3" />
            </RBarChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      {/* ✅ User Functions Tab */}
      <TabPanel value={tab} index={3}>
        <Typography variant="h6" gutterBottom>
          User Functions (Preview)
        </Typography>
        <Travels /> {/* Reuse user component */}
      </TabPanel>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default AdminDashboard;
