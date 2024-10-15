import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rootURL } from "../../config/baseApi";

// Async thunk to fetch the course data
export const fetchNews = createAsyncThunk(
  "courses/fetchNews",
  async (departmentNames) => {
    try {

        const params = new URLSearchParams({
          department_names: JSON.stringify(departmentNames),
        }); 
      const response = await fetch(`${rootURL}/news/news.php`);
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

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
