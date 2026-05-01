import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await API.getAllTasksRequest(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data, { rejectWithValue }) => {
    try {
      return (await API.createReviewTaskRequest(data)).data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (args, { rejectWithValue }) => {
    try {
      return (await API.updateTaskRequest(args)).data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.deleteTaskRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    allTasks: [],
    managerTasks: [],
    count: 0,
    isFetching: false,
    error: null,
    refreshCounter: 0,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload.meta && action.payload.meta.limit !== null) {
          state.managerTasks = action.payload.data;
          state.count = Number(action.payload.meta.count);
        } else {
          state.allTasks = action.payload.data || action.payload;
          state.count = state.allTasks.length;
        }
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('tasks/') && action.type.endsWith('/pending'),
        (state) => {
          state.isFetching = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            createTask.fulfilled,
            updateTask.fulfilled,
            deleteTask.fulfilled,
          ].some((t) => t.type === action.type),
        (state) => {
          state.isFetching = false;
          state.refreshCounter += 1;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('tasks/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isFetching = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
