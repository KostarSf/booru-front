import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <AppBar
        position="static"
        sx={{
          display: { xs: "none", md: "flex" },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              mr: 2,
              display: "block",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BOORU VIEW
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Button
              sx={{
                my: 2,
                color: "white",
                display: "block",
              }}
              onClick={() => navigate("/feed")}
            >
              Лента
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default NavBar;
