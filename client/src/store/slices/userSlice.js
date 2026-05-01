import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.registerRequest(userData);
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.loginRequest(userData);
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Invalid email or password');
    }
  }
);

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.getUserRequest();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Session expired');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.updateUserRequest(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isFetching: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.user = payload.user;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.user = payload.user;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.user = payload.user || payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isFetching = false;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        const updatedData = payload.user || payload;
        state.user = { ...state.user, ...updatedData };
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith('/fulfilled') &&
          (action.type.includes('payout/topUp') ||
            action.type.includes('payout/withdraw') ||
            action.type.includes('solutions/accept') ||
            action.type.includes('vacancies/create') ||
            action.type.includes('vacancies/delete')),
        (state, { payload }) => {
          if (state.user && payload) {
            const balance = payload.newBalance ?? payload.user?.balance;
            if (balance !== undefined) {
              state.user.balance = balance;
            }
          }
        }
      );
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
