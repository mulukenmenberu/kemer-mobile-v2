import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rootURL } from "../../config/baseApi";

// Async thunk to fetch the course data
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (departmentNames) => {
    try {

      const params = departmentNames[0] != "no_department_names" ? new URLSearchParams({
        department_names: JSON.stringify(departmentNames),
      }) : new URLSearchParams({
        no_department_names: JSON.stringify(departmentNames),
      });
      const response = await fetch(`${rootURL}/courses/courses.php?${params.toString()}`);
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

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coursesSlice.reducer;
