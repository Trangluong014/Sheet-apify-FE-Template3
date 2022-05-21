import { Link, Typography, Box } from "@mui/material";
import React from "react";

function MainFooter() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" align="right" p={1}>
        Copyright © sheet-apify {new Date().getFullYear()} .
      </Typography>
    </Box>
  );
}

export default MainFooter;
