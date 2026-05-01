import { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../../store/slices/userSlice';
import Input from '../../Helpers/Input/Input';
import SCHEMAS from '../../../utils/validationSchems';
import CONSTANTS from '../../../constants';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate(CONSTANTS.APP_ROUTERS.HOME);
    }
    setSubmitting(false);
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    window.history.length <= 1
      ? navigate(CONSTANTS.APP_ROUTERS.HOME)
      : navigate(-1);
  };

  return (
    <section className={styles.formWrapper}>
      <button onClick={handleGoBack} className={styles.backBtn} title="Back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>
      <h2 className={styles.title}>Welcome Back</h2>
      {error && (
        <div className={styles.serverError}>
          <span className={styles.errorIcon}>✕</span>
          <span>
            {typeof error === 'string' ? error : 'Invalid email or password'}
          </span>
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={SCHEMAS.UserLoginSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className={styles.formContainer}>
            <Input name="email" type="email" placeholder="Email Address" />
            <Input name="password" type="password" placeholder="Password" />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isFetching}
            >
              {isFetching ? 'Signing in...' : 'Login'}
            </button>
            <div className={styles.footerLink}>
              <span>Don't have an account? </span>
              <Link to={CONSTANTS.APP_ROUTERS.REGISTRATION}>Register here</Link>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default LoginForm;
