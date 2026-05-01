import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const fetchVacancies = createAsyncThunk(
  'vacancies/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.getVacanciesRequest(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Loading failed');
    }
  }
);

export const fetchVacancyById = createAsyncThunk(
  'vacancies/fetchById',
  async (vacancyId, { rejectWithValue }) => {
    try {
      const { data } = await API.getVacancyByIdRequest(vacancyId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Loading details failed');
    }
  }
);

export const createVacancy = createAsyncThunk(
  'vacancies/create',
  async (vacancyData, { rejectWithValue }) => {
    try {
      const { data } = await API.createVacancyRequest(vacancyData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Creation failed');
    }
  }
);

export const updateVacancy = createAsyncThunk(
  'vacancies/update',
  async ({ vacancyId, data }, { rejectWithValue }) => {
    try {
      const response = await API.updateVacancyRequest({ vacancyId, data });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

export const deleteVacancy = createAsyncThunk(
  'vacancies/delete',
  async (vacancyId, { rejectWithValue }) => {
    try {
      const { data } = await API.deleteVacancyRequest(vacancyId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Deletion failed');
    }
  }
);

const vacancySlice = createSlice({
  name: 'vacancies',
  initialState: {
    items: [],
    count: 0,
    isFetching: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearVacancyError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.items = payload?.data || [];
        state.count = payload?.meta?.count || 0;
      })
      .addCase(fetchVacancies.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(fetchVacancyById.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchVacancyById.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        const vacancyData = payload.data;
        const index = state.items.findIndex(
          (item) => String(item.id) === String(vacancyData.id)
        );
        if (index !== -1) {
          state.items[index] = vacancyData;
        } else {
          state.items.push(vacancyData);
        }
      })
      .addCase(fetchVacancyById.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(createVacancy.pending, (state) => {
        state.isFetching = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createVacancy.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.createSuccess = true;
        if (payload?.data) {
          state.items.unshift(payload.data);
          state.count += 1;
        }
      })
      .addCase(createVacancy.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(updateVacancy.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(updateVacancy.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.createSuccess = true;
        const updatedItem = payload?.data;
        if (updatedItem) {
          const index = state.items.findIndex(
            (item) => String(item.id) === String(updatedItem.id)
          );
          if (index !== -1) {
            state.items[index] = updatedItem;
          }
        }
      })
      .addCase(updateVacancy.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(deleteVacancy.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(deleteVacancy.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.items = state.items.filter(
          (item) => String(item.id) !== String(payload?.id)
        );
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteVacancy.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('solutions/') &&
          action.type.endsWith('/fulfilled'),
        (state, { payload, type }) => {
          state.items.forEach((vacancy) => {
            if (vacancy.solutions && Array.isArray(vacancy.solutions)) {
              const hasTargetSolution = vacancy.solutions.some(
                (s) => String(s.id) === String(payload.solutionId)
              );

              if (hasTargetSolution) {
                const isAccepted = type.includes('accept');
                const isRejected = type.includes('reject');

                if (isAccepted) {
                  vacancy.status = 'completed';

                  vacancy.solutions.forEach((sol) => {
                    if (String(sol.id) === String(payload.solutionId)) {
                      sol.status = 'accepted';
                    } else if (sol.status === 'pending') {
                      sol.status = 'rejected';
                    }
                  });
                } else if (isRejected) {
                  const solIndex = vacancy.solutions.findIndex(
                    (s) => String(s.id) === String(payload.solutionId)
                  );
                  if (solIndex !== -1) {
                    vacancy.solutions[solIndex].status = 'rejected';
                  }
                }
              }
            }
          });
        }
      );
  },
});

export const { clearVacancyError, resetCreateStatus } = vacancySlice.actions;
export default vacancySlice.reducer;
