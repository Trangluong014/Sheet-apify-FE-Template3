import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { Link } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

import { useSelector, useDispatch } from "react-redux";

import { useWebsiteConfig } from "../hooks/useWebsiteConfig";

function MainHeader() {
  const { website } = useSelector(state => state.website);

  let navigate = useNavigate();
  const websiteConfig = useWebsiteConfig();

  return (
    <Box style={{ marginBottom: 15, flex: 0 }}>
      <AppBar position="static">
        <Toolbar style={{ display:"flex", justifyContent: "space-between" }}>
          <Link
            color="inherit"
            aria-label="menu"
            href={website?.websiteId 
              ? `/${website.websiteId}`
              : "javascript:void(0)"
            }
            style={{ 
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {websiteConfig.logo && 
              <img 
                alt={website?.name || "logo"} 
                src={websiteConfig.logo} 
                style={{ height: 32, marginRight: "1rem" }} 
              />}
            {website?.name}
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
