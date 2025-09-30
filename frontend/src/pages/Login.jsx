import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalShipping,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Haycarb email validation
    if (!email.endsWith("@haycarb.com")) {
      setError("Only Haycarb employees can login. Use your @haycarb.com email.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.access_token);
      const decoded = jwtDecode(res.data.access_token);
      localStorage.setItem("role", decoded.role);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1B5E20 0%, #4ba24fff 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              mb: 2,
              bgcolor: "white",
              boxShadow: 4,
            }}
          >
            <LocalShipping sx={{ fontSize: 40, color: "#667eea" }} />
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
            LogiTrack
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Logistics Management System
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper elevation={24} sx={{ padding: 4, borderRadius: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Sign in to continue to your dashboard
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              <Link href="#" underline="hover" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                background: "linear-gradient(135deg, #1B5E20 0%, #4ba24fff 100%)",
                boxShadow: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #1B5E20 0%, #4ba24fff 100%)",
                  boxShadow: 6,
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link href="/register" underline="hover" sx={{ fontWeight: 600 }}>
              Sign up for free
            </Link>
          </Typography>
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: "rgba(255,255,255,0.9)" }}>
          © 2025 HayCarb. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
