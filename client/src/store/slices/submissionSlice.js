import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.createSubmissionRequest(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit work'
      );
    }
  }
);

export const getMyGrades = createAsyncThunk(
  'submissions/getMyGrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.getMyGradesRequest();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch grades');
    }
  }
);

export const getPendingSubmissions = createAsyncThunk(
  'submissions/getPending',
  async (params, { rejectWithValue }) => {
    try {
      const response = await API.getPendingSubmissionsRequest(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to fetch pending work'
      );
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'submissions/grade',
  async ({ submissionId, data }, { rejectWithValue }) => {
    try {
      const response = await API.gradeSubmissionRequest({ submissionId, data });
      return response.data.submission;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Grading failed');
    }
  }
);

const submissionSlice = createSlice({
  name: 'submissions',
  initialState: {
    myGrades: [],
    pendingSubmissions: [],
    count: 0,
    isFetching: false,
    error: null,
  },
  reducers: {
    clearSubmissionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubmission.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.isFetching = false;
        state.myGrades.push(action.payload);
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(getMyGrades.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getMyGrades.fulfilled, (state, action) => {
        state.isFetching = false;
        state.myGrades = action.payload;
      })
      .addCase(getMyGrades.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(getPendingSubmissions.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getPendingSubmissions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.pendingSubmissions = action.payload.submissions;
        state.count = action.payload.count;
      })
      .addCase(getPendingSubmissions.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.isFetching = false;
        state.pendingSubmissions = state.pendingSubmissions.filter(
          (s) => s.id !== action.payload.id
        );
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmissionError } = submissionSlice.actions;
export default submissionSlice.reducer;
