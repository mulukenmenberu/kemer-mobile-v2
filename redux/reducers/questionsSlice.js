import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL, rootURL } from "../../config/baseApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (packageId, { rejectWithValue }) => {
    try {
      // Check if the data is in cache
      const cacheKey = `questions_${packageId}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRATION;
        
        if (!isExpired) {
          // Return cached data if it's not expired
          return data;
        }
      }

      // Fetch from API if no cached data or cache is expired
      const response = await fetch(`${rootURL}questions/questions.php?package_id=${packageId}`);
      const data = await response.json();
     
      if (data.status === 'success') {
        // Save data to cache with timestamp
        await AsyncStorage.setItem(cacheKey, JSON.stringify({ data: data.data, timestamp: Date.now() }));
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default questionsSlice.reducer;
