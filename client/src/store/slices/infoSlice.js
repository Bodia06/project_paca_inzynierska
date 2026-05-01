import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const getInfo = createAsyncThunk(
  'info/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await API.getInfoRequest(filters);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch info');
    }
  }
);

export const createInfo = createAsyncThunk(
  'info/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.createInfoRequest(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create info');
    }
  }
);

export const updateInfo = createAsyncThunk(
  'info/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.updateInfoRequest({ id, data });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

export const deleteInfo = createAsyncThunk(
  'info/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.deleteInfoRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Delete failed');
    }
  }
);

const infoSlice = createSlice({
  name: 'info',
  initialState: {
    info: [],
    count: 0,
    isFetching: false,
    error: null,
  },
  reducers: {
    clearInfoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.isFetching = false;
        state.info = action.payload.data;
        state.count = action.payload.meta.count;
      })
      .addCase(getInfo.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(createInfo.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(createInfo.fulfilled, (state, action) => {
        state.isFetching = false;
        state.info.unshift(action.payload.data);
        state.count += 1;
      })
      .addCase(createInfo.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(updateInfo.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.isFetching = false;
        const index = state.info.findIndex(
          (i) => i.id === action.payload.data.id
        );
        if (index !== -1) {
          state.info[index] = action.payload.data;
        }
      })
      .addCase(updateInfo.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(deleteInfo.fulfilled, (state, action) => {
        state.isFetching = false;
        state.info = state.info.filter((i) => i.id !== action.payload);
        state.count -= 1;
      })
      .addCase(deleteInfo.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { clearInfoError } = infoSlice.actions;
export default infoSlice.reducer;
