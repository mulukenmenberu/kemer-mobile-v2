import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rootURL } from "../../config/baseApi";

// Async thunk to fetch the course data
export const fetchSubjects = createAsyncThunk(
  "courses/fetchSubjects",
  async (levels) => {
    try {

        const params = new URLSearchParams({
          level: JSON.stringify(levels),
        }); 

      const response = await fetch(`${rootURL}notes/get_note_info.php?level=${levels}`);
      // console.log(`${rootURL}notes/get_note_info.php?${levels.toString()}`)
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

const notesSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: {},
    loadings: false,
    errors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loadings = true;
        state.errors = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loadings = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loadings = false;
        state.errors = action.error.message;
      });
  },
});

export default notesSlice.reducer;
