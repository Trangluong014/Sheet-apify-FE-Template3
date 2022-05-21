import { Box, Stack } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { getSingleWebsite } from "../features/websites/websiteSlice";
import { getAllExpenses } from "../features/expenses/expensesSlice";
import { getAllCategories } from "../features/categories/categoriesSlice";

import { useDispatch, useSelector } from "react-redux";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";
import { Outlet, useParams } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';

import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";

function MainLayout() {
  const { websiteId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (websiteId) dispatch(getSingleWebsite(websiteId));
  }, [websiteId])

  const { website } = useSelector(state => state.website);
  
  useEffect(() => {
    dispatch(getAllExpenses())
    dispatch(getAllCategories())
  }, [website]);

  const websiteConfig = useWebsiteConfig();
  const theme = useMemo(() => {
    return createTheme((websiteConfig?.theme || {}))
  }, [websiteConfig]);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        sx={{ minHeight: "100vh", maxHeight: "100vh", overflow: 'hidden' }} 
        style={{ 
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <MainHeader />
        <Outlet />
        {/* <MainFooter /> */}
      </Stack>
    </ThemeProvider>
  );
}

export default MainLayout;
