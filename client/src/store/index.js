import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import infoReducer from './slices/infoSlice';
import taskSlice from './slices/taskSlice';
import submissionSlice from './slices/submissionSlice';
import vacancySlice from './slices/vacancySlice';
import payoutSlice from './slices/payoutSlice';
import solutionSlice from './slices/solutionSlice';

const appReducer = combineReducers({
  user: userSlice,
  info: infoReducer,
  task: taskSlice,
  submissions: submissionSlice,
  vacancies: vacancySlice,
  payout: payoutSlice,
  solutions: solutionSlice,
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
