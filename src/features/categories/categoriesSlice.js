import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWebsiteConfig } from "../websites/websiteSlice"
import apiService from "../../app/apiService";

import _range from "lodash/range";
import _merge from "lodash/merge";

const initialState = {
  isLoading: false,
  status: "idle",
  error: null,
  totalPage: 0,
  categories: [],
};

const slice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state, action) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.error = "";
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message;
      });

  },
});

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { getState }) => {
    const state = getState();
    const spreadsheetId = state.website?.website?.spreadsheetId;
    if (spreadsheetId) {
      const response = await apiService.get(`/item/${spreadsheetId}`, {
        params: {
          range: 'Category',
          limit: 20,
        }
      });
      return response.data.data?.itemList;
    }
  }
);

export default slice.reducer;
