import { configureStore } from "@reduxjs/toolkit";
import websiteReducer from "../features/websites/websiteSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import categoriesSlice from "../features/categories/categoriesSlice";

const rootReducer = {
  website: websiteReducer,
  expenses: expensesReducer,
  categories: categoriesSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
