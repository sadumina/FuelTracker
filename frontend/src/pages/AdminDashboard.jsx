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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { People, DirectionsCar, BarChart, Dashboard, Download } from "@mui/icons-material";
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
import Travels from "./Travels";

// 📦 PDF library
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// ✅ Utility: CSV/JSON download
const downloadFile = (data, filename, type = "csv") => {
  if (!data || data.length === 0) {
    alert("No data available to download.");
    return;
  }

  let blob;
  if (type === "json") {
    blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  } else {
    const headers = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    blob = new Blob([headers + rows], { type: "text/csv" });
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ✅ Utility: Enhanced PDF download
const downloadPDF = (data, filename, title) => {
  if (!data || data.length === 0) {
    alert("No data to download.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16).setFont("helvetica", "bold");
  doc.text("Haycarb PLC - FuelTracker Report", 14, 15);

  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(title, 14, 23);

  autoTable(doc, {
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
    startY: 30,
    theme: "striped",
    headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255], halign: "center" },
    bodyStyles: { halign: "center", valign: "middle" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: (dataArg) => {
      const pageCount = doc.internal.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height || pageSize.getHeight();
      const today = new Date();

      doc.setFontSize(10).setTextColor(100);
      doc.text(
        `Exported on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
        dataArg.settings.margin.left,
        pageHeight - 10
      );
      doc.text(
        `Page ${dataArg.pageNumber} of ${pageCount}`,
        pageSize.width - dataArg.settings.margin.right - 40,
        pageHeight - 10
      );
    },
  });

  doc.save(filename);
};

function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  // Fetch travel logs
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

  // Role update
  const updateRole = async (email, role) => {
    try {
      setLoading(true);
      await API.put(`/users/${email}`, { role });
      setSnackbar({ open: true, message: `✅ Updated ${email} to ${role}`, severity: "success" });
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
      setSnackbar({ open: true, message: `🗑️ Deleted ${email}`, severity: "success" });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.detail || "Delete failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Analytics data
  const officialTotal = logs.reduce((sum, l) => sum + (l.official_km || 0), 0);
  const privateTotal = logs.reduce((sum, l) => sum + (l.private_km || 0), 0);
  const distanceByUser = users.map((u) => ({
    name: u.name,
    total: logs.filter((l) => l.user_email === u.email).reduce((s, l) => s + (l.total_km || 0), 0),
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Admin Dashboard – Haycarb PLC
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4" color="primary">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Official KM</Typography>
              <Typography variant="h4" color="success.main">{officialTotal}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Private KM</Typography>
              <Typography variant="h4" color="error.main">{privateTotal}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          mb: 2,
          "& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 700 },
          "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
        }}
      >
        <Tab icon={<People />} label="Users" />
        <Tab icon={<DirectionsCar />} label="Travel Logs" />
        <Tab icon={<BarChart />} label="Analytics" />
        <Tab icon={<Dashboard />} label="User Functions" />
      </Tabs>

      {/* Users Tab */}
      <TabPanel value={tab} index={0}>
        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="contained" startIcon={<Download />} onClick={() => downloadFile(users, "user_list.csv")}>
            CSV
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={() => downloadPDF(users, "users.pdf", "User List")}>
            PDF
          </Button>
        </Box>
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
                      <Chip label={u.role} color={u.role === "admin" ? "success" : "default"} size="small" />
                    </TableCell>
                    <TableCell>
                      {u.role !== "admin" && (
                        <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => updateRole(u.email, "admin")} disabled={loading}>
                          Make Admin
                        </Button>
                      )}
                      {u.role !== "employee" && (
                        <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => updateRole(u.email, "employee")} disabled={loading}>
                          Make Employee
                        </Button>
                      )}
                      <Button variant="contained" color="error" size="small" onClick={() => deleteUser(u.email)} disabled={loading}>
                        Delete
                      </Button>
                      <Button variant="text" size="small" onClick={() => navigate(`/dashboard?user=${u.email}`)}>
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
        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="contained" startIcon={<Download />} onClick={() => downloadFile(logs, "travel_logs.csv")}>
            CSV
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={() => downloadPDF(logs, "travel_logs.pdf", "Travel Logs")}>
            PDF
          </Button>
        </Box>
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
                      <Chip label={`${log.total_km} km`} color="primary" size="small" />
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
        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => downloadFile([{ officialTotal, privateTotal, distanceByUser }], "analytics_summary.json", "json")}
          >
            JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => downloadPDF([{ OfficialKM: officialTotal, PrivateKM: privateTotal, Users: users.length }], "analytics_summary.pdf", "Analytics Summary")}
          >
            PDF
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          Analytics Overview
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {/* Official vs Private Pie */}
          <ResponsiveContainer width="45%" height={300}>
            <PieChart>
              <Pie data={[{ name: "Official KM", value: officialTotal }, { name: "Private KM", value: privateTotal }]} dataKey="value" outerRadius={100} label>
                <Cell fill="#2E7D32" /> {/* Haycarb Green */}
                <Cell fill="#c62828" /> {/* Red for private */}
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
              <Bar dataKey="total" fill="#1976d2" />
            </RBarChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      {/* User Functions Tab */}
      <TabPanel value={tab} index={3}>
        <Typography variant="h6" gutterBottom>
          User Functions (Preview)
        </Typography>
        <Travels />
      </TabPanel>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box sx={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default AdminDashboard;
