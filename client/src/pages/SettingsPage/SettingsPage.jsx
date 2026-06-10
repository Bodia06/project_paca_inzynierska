import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { updateUser, clearError } from '../../store/slices/userSlice';
import SettingsForm from '../../components/SettingsComponents/SettingsFrom/SettingsFrom';
import Spinner from '../../components/Helpers/Spinner/Spinner';
import SCHEMAS from '../../utils/validationSchems';
import styles from './SettingsPage.module.css';

function SettingsPage() {
  const {
    user,
    isFetching,
    error: serverError,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    file: null,
  };

  const handleSubmit = (values) => {
    const data = new FormData();
    data.append('firstName', values.firstName);
    data.append('lastName', values.lastName);
    data.append('displayName', values.displayName);
    data.append('email', values.email);
    if (values.file) data.append('avatar', values.file);

    dispatch(updateUser(data));
  };

  if (!user) {
    return (
      <div className={styles.loaderWrapper}>
        <Spinner />
      </div>
    );
  }

  return (
    <section className={styles.settingsPageWrapper}>
      <article className={styles.settingsGlassCard}>
        <div className={styles.settingsCover}></div>
        <div className={styles.settingsHeaderContent}>
          <div className={styles.settingsMainInfo}>
            <h2 className={styles.settingsTitle}>Account Management</h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={SCHEMAS.UserUpdateSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values, dirty }) => (
            <SettingsForm
              values={values}
              setFieldValue={setFieldValue}
              dirty={dirty}
              isFetching={isFetching}
              serverError={serverError}
              user={user}
            />
          )}
        </Formik>
      </article>
    </section>
  );
}

export default SettingsPage;
