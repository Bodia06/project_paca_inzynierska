import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api/restApi/restControllers';

export const topUpBalance = createAsyncThunk(
  'payout/topUp',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await API.topUpBalanceRequest(paymentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Deposit failed');
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'payout/withdraw',
  async (amountData, { rejectWithValue }) => {
    try {
      const { data } = await API.withdrawFundsRequest(amountData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Withdrawal failed');
    }
  }
);

const payoutSlice = createSlice({
  name: 'payout',
  initialState: {
    isProcessing: false,
    error: null,
    statusMessage: '',
    lastTransactionSuccess: false,
  },
  reducers: {
    clearPayoutStatus: (state) => {
      state.error = null;
      state.statusMessage = '';
      state.lastTransactionSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(topUpBalance.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.lastTransactionSuccess = false;
      })
      .addCase(topUpBalance.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.statusMessage =
          payload.statusMessage || 'Balance topped up successfully';
        state.lastTransactionSuccess = true;
      })
      .addCase(topUpBalance.rejected, (state, { payload }) => {
        state.isProcessing = false;
        state.error = payload;
      })
      .addCase(withdrawFunds.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.lastTransactionSuccess = false;
      })
      .addCase(withdrawFunds.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.statusMessage = payload.statusMessage || 'Withdrawal successful';
        state.lastTransactionSuccess = true;
      })
      .addCase(withdrawFunds.rejected, (state, { payload }) => {
        state.isProcessing = false;
        state.error = payload;
      });
  },
});

export const { clearPayoutStatus } = payoutSlice.actions;
export default payoutSlice.reducer;
