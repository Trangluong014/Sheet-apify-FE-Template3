import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import defaultConfig from "../../config.json";
import { deepmerge } from '@mui/utils';

const initialState = {
  isLoading: false,
  status: "idle",
  error: null,
  totalPage: 0,
  website: null,
};

const slice = createSlice({
  name: "website",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleWebsite.pending, (state, action) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getSingleWebsite.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.error = "";
        state.website = action.payload.website;
      })
      .addCase(getSingleWebsite.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const getSingleWebsite = createAsyncThunk(
  "websites/getSingleWebsite",
  async (websiteId) => {
    const response = await apiService.get(`/website/${websiteId}`);
    return response.data.data;
  }
);

export default slice.reducer;

export const getWebsiteConfig = (state) => {
  const stateConfig = state?.website?.website?.config;
  return deepmerge(
    (defaultConfig || {}), 
    (stateConfig || {}),
  )
}