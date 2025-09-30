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
  Button,
  Tooltip,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsCar,
  Person,
  Logout,
  LocalGasStation,
} from "@mui/icons-material";

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const hideNavbarRoutes = ["/", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Only user pages now
  const pages = [
    { name: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { name: "My Travels", path: "/travels", icon: <DirectionsCar /> },
  ];

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    handleCloseUserMenu();
  };

  const navigateToPage = (path) => {
    navigate(path);
    handleCloseUserMenu();
    setMobileOpen(false);
  };

  // Mobile drawer
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          py: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
        }}
      >
        <LocalGasStation sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Fuel Manager
        </Typography>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              onClick={() => navigateToPage(page.path)}
              selected={location.pathname === page.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === page.path
                      ? theme.palette.primary.main
                      : "inherit",
                }}
              >
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" onClick={handleDrawerToggle} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo - Desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                mr: 4,
                cursor: "pointer",
              }}
              onClick={() => navigateToPage("/dashboard")}
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

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => navigateToPage(page.path)}
                  startIcon={page.icon}
                  sx={{
                    my: 2,
                    mx: 0.5,
                    color: "white",
                    px: 2,
                    borderRadius: 2,
                    backgroundColor:
                      location.pathname === page.path ? alpha("#fff", 0.15) : "transparent",
                    "&:hover": { backgroundColor: alpha("#fff", 0.2) },
                  }}
                >
                  {page.name}
                </Button>
              ))}
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
                <MenuItem onClick={() => navigateToPage("/profile")}>
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

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
