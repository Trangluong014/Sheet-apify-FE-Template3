import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWebsiteConfig } from "../websites/websiteSlice";
import apiService from "../../app/apiService";
import { LIMIT_PER_PAGE } from "../../app/config";

import _range from "lodash/range";
import _merge from "lodash/merge";
import addMonths from "date-fns/addMonths";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";

const initialState = {
  isLoading: false,
  status: "idle",
  error: null,
  totalPage: 0,
  expenses: {
    // year: {
    //   month: {
    //     ...data
    //   },
    // },
  },
};

const slice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExpenses.pending, (state, action) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getAllExpenses.fulfilled, (state, action) => {
        state.status = "idle";
        state.isLoading = false;
        state.error = "";
        state.expenses = action.payload;
      })
      .addCase(getAllExpenses.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const getAllExpenses = createAsyncThunk(
  "expenses/getAllExpenses",
  async (_, { getState }) => {
    const state = getState();
    const spreadsheetId = state.website?.website?.spreadsheetId;
    if (spreadsheetId) {
      const config = getWebsiteConfig(state);
      const currentDate = new Date();
      const promises = _range(config?.monthsToLoad, 1)
        .map((month) => addMonths(currentDate, month))
        .map((month) => ({ month: getMonth(month) + 1, year: getYear(month) }))
        .map(async (date) => {
          const response = await apiService.get(`/item/${spreadsheetId}`, {
            params: {
              limit: LIMIT_PER_PAGE,
              sort: "month",
              order: "desc",
              month: date.month,
              year: date.year,
            },
          });
          return {
            [date.year]: {
              [date.month]: response.data.data?.itemList,
            },
          };
        });
      const data = await Promise.all(promises);
      return data.reduce((acc, curr) => _merge(acc, curr), {});
    }
  }
);

export const addNewExpense = createAsyncThunk(
  "expenses/addNewExpense",
  async (data, { getState, dispatch }) => {
    const website = getState().website;
    const spreadsheetId = website.website?.spreadsheetId;
    if (spreadsheetId) {
      const ranges = website.website?.ranges;
      const response = await apiService.post(
        `/google/${spreadsheetId}/${ranges[0]}/`,
        {
          ...data,
        }
      );
      dispatch(getAllExpenses());
      return response.data.data;
    }
  }
);

export default slice.reducer;
