import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person,
  Logout,
  LocalGasStation,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const hideNavbarRoutes = ["/", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          {/* Back & Forward Buttons */}
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate(1)}>
            <ArrowForward />
          </IconButton>

          {/* Logo - Left */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              flexGrow: 1,
              ml: 2,
            }}
            onClick={() => navigate("/dashboard")}
          >
            <LocalGasStation sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 700, letterSpacing: ".1rem", color: "inherit" }}
            >
              Fuel Manager
            </Typography>
          </Box>

          {/* User Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#fff", 0.2),
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="body1" fontWeight="600" noWrap>
                  {user.name || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.email || ""}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate("/profile")}>
                <Person fontSize="small" />
                <Typography sx={{ ml: 1 }}>Profile</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" color="error" />
                <Typography sx={{ ml: 1, color: "error.main" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
