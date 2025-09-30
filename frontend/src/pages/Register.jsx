import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Divider,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  EmailOutlined,
  CreditCard,
  LockOutlined,
} from "@mui/icons-material";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fuelCardNo, setFuelCardNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Force role = "employee"
      await API.post("/users/register", {
        name,
        email,
        password,
        fuel_card_no: fuelCardNo,
      });

      alert("✅ Registered successfully. Please login.");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
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
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "white",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
              py: 5,
              px: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: alpha("#fff", 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <PersonOutline sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Join us to manage your fuel expenses efficiently
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleRegister} noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Full Name */}
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email */}
                <TextField
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password */}
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  helperText="Minimum 8 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
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

                {/* Fuel Card Number */}
                <TextField
                  label="Fuel Card Number"
                  variant="outlined"
                  fullWidth
                  value={fuelCardNo}
                  onChange={(e) => setFuelCardNo(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Box>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Login Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/")}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 3,
              }}
            >
              By registering, you agree to our{" "}
              <Link href="#" underline="hover">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" underline="hover">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
