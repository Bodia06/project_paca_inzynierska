import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../../store/slices/userSlice';
import Input from '../../Helpers/Input/Input';
import Select from '../../Helpers/Select/Select';
import SCHEMAS from '../../../utils/validationSchems';
import CONSTANTS from '../../../constants';
import styles from './RegistrationForm.module.css';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { error, isFetching } = useSelector((state) => state.user);
  const queryParams = new URLSearchParams(search);
  const roleFromUrl = queryParams.get('role');

  const initialValues = {
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleFromUrl || 'beginner',
    agreeOfTerms: false,
  };

  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const resultAction = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(resultAction)) {
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
      <h2 className={styles.title}>Registration</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={SCHEMAS.UserRegistrationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {() => (
          <Form className={styles.formContainer}>
            {error && (
              <div className={styles.serverError}>
                <div className={styles.errorIcon}>!</div>
                <span>
                  {typeof error === 'string'
                    ? error
                    : error.message || 'Error occurred'}
                </span>
              </div>
            )}
            <Input name="firstName" placeholder="First Name" />
            <Input name="lastName" placeholder="Last Name" />
            <Input name="displayName" placeholder="Display Name" />
            <Input name="email" type="email" placeholder="Email" />
            <Input name="password" type="password" placeholder="Password" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <Select name="role">
              <option value="beginner">Beginner</option>
              <option value="employer">Employer</option>
              <option value="moderator">Moderator</option>
            </Select>
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxLabel}>
                <Field
                  type="checkbox"
                  name="agreeOfTerms"
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>
                  I accept the Terms & Conditions
                </span>
              </label>
              <ErrorMessage name="agreeOfTerms">
                {(msg) => <div className={styles.checkboxError}>{msg}</div>}
              </ErrorMessage>
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isFetching}
            >
              {isFetching ? 'Processing...' : 'Create Account'}
            </button>
            <div className={styles.footerLink}>
              Already have an account?{' '}
              <Link to={CONSTANTS.APP_ROUTERS.LOGIN}>Login</Link>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default RegistrationForm;
