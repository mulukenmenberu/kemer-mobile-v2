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

export const fetchNotes = createAsyncThunk(
  "courses/fetchNotes",
  async ({selectedCourse, selectedTopic}) => {
    try {


      const response = await fetch(`${rootURL}notes/get_note.php?subject=${selectedCourse}&topic=${selectedTopic}`);
      // console.log(`${rootURL}notes/get_note.php?subject=${selectedCourse}&topic=${selectedTopic}`)
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


const worksheetSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: {},
    notes: [],
    loadings: false,
    errors: null,
    loadings2: false,
    errors2: null,
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
      })

      .addCase(fetchNotes.pending, (state) => {
        state.loadings2 = true;
        state.errors2 = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loadings2 = false;
        state.subjects = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loadings2 = false;
        state.errors2 = action.error.message;
      });
  },
});

export default worksheetSlice.reducer;
