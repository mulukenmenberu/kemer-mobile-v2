import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rootURL } from "../../config/baseApi";

// Async thunk to fetch question packages based on the course ID 
export const fetchQuestionPackages = createAsyncThunk(
  "questionPackages/fetchQuestionPackages",
  async (courseId) => {
    try {
      const response = await fetch(`${rootURL}question_packages/packages.php?course_id=${courseId}`);
      // console.log(`${rootURL}question_packages/packages.php?course_id=${courseId}`)
      const data = await response.json();

      if (data.status === 'success') {
        return data.data ?? [];
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error; // This will be caught and rejected in the thunk
    }
  }
);

export const fetchQuestionPackagesSaved = createAsyncThunk(
  "questionPackages/fetchQuestionPackagesSaved",
  async (commaCourseIDv) => {
    try {


      const response = await fetch(`${rootURL}question_packages/packages.php?${commaCourseIDv}`);
      console.log(`${rootURL}question_packages/packages.php?${commaCourseIDv}`)
      const data = await response.json();
      console.log(data, "dataaa")
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

const questionPackagesSlice = createSlice({
  name: "questionPackages",
  initialState: {
    packages: [],
    packagesSaved: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchQuestionPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchQuestionPackagesSaved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionPackagesSaved.fulfilled, (state, action) => {
        state.loading = false;
        state.packagesSaved = action.payload;
      })
      .addCase(fetchQuestionPackagesSaved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default questionPackagesSlice.reducer;
