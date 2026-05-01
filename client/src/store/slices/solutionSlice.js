import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const createSolution = createAsyncThunk(
  'solutions/create',
  async (solutionData, { rejectWithValue }) => {
    try {
      const { data } = await API.createSolutionRequest(solutionData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Solution submission failed'
      );
    }
  }
);

export const updateSolution = createAsyncThunk(
  'solutions/update',
  async ({ solutionId, githubLink }, { rejectWithValue }) => {
    try {
      const { data } = await API.updateSolutionRequest({
        solutionId,
        data: { githubLink },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Solution update failed');
    }
  }
);

export const acceptSolution = createAsyncThunk(
  'solutions/accept',
  async (solutionId, { rejectWithValue }) => {
    try {
      const { data } = await API.acceptSolutionRequest(solutionId);
      return { solutionId, ...data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Solution acceptance failed'
      );
    }
  }
);

export const rejectSolution = createAsyncThunk(
  'solutions/reject',
  async (solutionId, { rejectWithValue }) => {
    try {
      const { data } = await API.rejectSolutionRequest(solutionId);
      return { solutionId, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Solution rejection failed');
    }
  }
);

const solutionSlice = createSlice({
  name: 'solutions',
  initialState: {
    isFetching: false,
    error: null,
    successMessage: null,
    itemsByVacancy: {},
  },
  reducers: {
    clearSolutionStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setInitialSolution: (state, { payload }) => {
      if (payload) {
        const vId = payload.vacancyId || payload.VacancyId;
        if (vId) {
          state.itemsByVacancy[vId] = payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSolution.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(createSolution.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.itemsByVacancy[payload.vacancyId] = payload;
        state.successMessage = 'Solution submitted successfully';
      })
      .addCase(createSolution.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(updateSolution.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updateSolution.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.itemsByVacancy[payload.vacancyId] = payload;
        state.successMessage = 'GitHub link updated successfully';
      })
      .addCase(updateSolution.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(acceptSolution.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(acceptSolution.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.successMessage = payload.message || 'Solution accepted';
        Object.values(state.itemsByVacancy).forEach((sol) => {
          if (sol.id === payload.solutionId) sol.status = 'accepted';
        });
      })
      .addCase(acceptSolution.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(rejectSolution.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.successMessage = payload.message || 'Solution rejected';
        Object.values(state.itemsByVacancy).forEach((sol) => {
          if (sol.id === payload.solutionId) sol.status = 'rejected';
        });
      });
  },
});

export const { clearSolutionStatus, setInitialSolution } =
  solutionSlice.actions;
export default solutionSlice.reducer;
