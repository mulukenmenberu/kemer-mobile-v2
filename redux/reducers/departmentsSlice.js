import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL, rootURL } from "../../config/baseApi";

// Async thunk to fetch the department data
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    try {
      const response = await fetch(`${rootURL}departments/departments.php`);

      const data = await response.json();

      if (data.status === 'success') {
        return data.data; // Return the data to be used in the reducer
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error; // This will be caught and rejected in the thunk
    }
  }
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default departmentsSlice.reducer;
