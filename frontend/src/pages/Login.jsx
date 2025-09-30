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
  setLoading(true);

  try {
    const res = await API.post("/users/login", { email, password });

    // Save token
    localStorage.setItem("token", res.data.access_token);

    // Decode token to get role
    const decoded = jwtDecode(res.data.access_token);
    localStorage.setItem("role", decoded.role);

    // Redirect based on role
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo Section */}
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
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            LogiTrack
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Logistics Management System
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Sign in to continue to your dashboard
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
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

            {/* Password Field */}
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Login Button */}
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)",
                  boxShadow: 6,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Paper
            variant="outlined"
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "#f0f4ff",
              borderColor: "#667eea",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "#667eea", display: "block", mb: 0.5 }}
            >
              Demo Credentials:
            </Typography>
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
              Email: demo@example.com
            </Typography>
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
              Password: demo123
            </Typography>
          </Paper>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          {/* Social Login Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none", py: 1.5 }}
            >
              <Box
                component="img"
                src="https://www.google.com/favicon.ico"
                sx={{ width: 20, height: 20, mr: 1 }}
              />
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none", py: 1.5 }}
            >
              <Box
                component="img"
                src="https://github.com/favicon.ico"
                sx={{ width: 20, height: 20, mr: 1 }}
              />
              GitHub
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Link href="/register" underline="hover" sx={{ fontWeight: 600 }}>
              Sign up for free
            </Link>
          </Typography>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "rgba(255,255,255,0.9)" }}
        >
          © 2025 LogiTrack. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;