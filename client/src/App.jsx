import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProfile } from './store/slices/userSlice';
import Spinner from './components/Helpers/Spinner/Spinner';
import PrivateRoute from './components/Routers/PrivateRoute';
import PublicRoute from './components/Routers/PublicRoute';
import AppLayout from './components/AppLayout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import InfoPage from './pages/InfoPage/InfoPage';
import TasksPage from './pages/TasksPage/TasksPage';
import WorkPage from './pages/WorkPage/WorkPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import UserPage from './pages/UserPage/UserPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import InfoDetailsPage from './pages/InfoDetailsPage/InfoDetailsPage';
import ModerationPage from './pages/ModerationPage/ModerationPage';
import EmployerPage from './pages/EmployerPage/EmployerPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import VacancyDetailsPage from './pages/VacancyDetailsPage/VacancyDetailsPage';
import NotFound from './pages/NotFound/NotFound';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import CONSTANTS from './constants';
import './App.css';

function App() {
  const dispatch = useDispatch();

  const { user, isFetching } = useSelector((state) => state.user) || {};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  if (isFetching && !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={CONSTANTS.APP_ROUTERS.HOME} element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={CONSTANTS.APP_ROUTERS.INFO} element={<InfoPage />} />
          <Route path={CONSTANTS.APP_ROUTERS.TASKS} element={<TasksPage />} />
          <Route path={CONSTANTS.APP_ROUTERS.WORK} element={<WorkPage />} />
          <Route element={<PrivateRoute user={user} isFetching={isFetching} />}>
            <Route
              path={CONSTANTS.APP_ROUTERS.VACANCY_DETAILS}
              element={<VacancyDetailsPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.INFO_DETAILS}
              element={<InfoDetailsPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.PROFILE}
              element={<UserPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.SETTINGS}
              element={<SettingsPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.MODERATION_PANEL}
              element={<ModerationPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.EMPLOYER_PANEL}
              element={<EmployerPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.PAYMENT}
              element={<PaymentPage />}
            />
            <Route
              path={CONSTANTS.APP_ROUTERS.CASHOUT}
              element={<PaymentPage />}
            />
          </Route>
        </Route>

        <Route element={<PublicRoute user={user} />}>
          <Route path={CONSTANTS.APP_ROUTERS.LOGIN} element={<LoginPage />} />
          <Route
            path={CONSTANTS.APP_ROUTERS.REGISTRATION}
            element={<RegistrationPage />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
