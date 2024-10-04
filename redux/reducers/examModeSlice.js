import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rootURL } from "../../config/baseApi";

// Async thunk to fetch the course data
export const fetchExamMode = createAsyncThunk(
  "courses/fetchExamMode",
  async (departmentNames) => {
    try {

        const params = new URLSearchParams({
          department_names: JSON.stringify(departmentNames),
        }); 
      const response = await fetch(`${rootURL}/courses/exam_mode.php?${params.toString()}`);
      // console.log(`${rootURL}/courses/courses.php?${params.toString()}`)
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

const examModeSlice = createSlice({
  name: "examMode",
  initialState: {
    examMode: [],
    loadingg: false,
    errorr: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamMode.pending, (state) => {
        state.loadingg = true;
        state.errorr = null;
      })
      .addCase(fetchExamMode.fulfilled, (state, action) => {
        state.loadingg = false;
        state.examMode = action.payload;
      })
      .addCase(fetchExamMode.rejected, (state, action) => {
        state.loadingg = false;
        state.errorr = action.error.message;
      });
  },
});

export default examModeSlice.reducer;
