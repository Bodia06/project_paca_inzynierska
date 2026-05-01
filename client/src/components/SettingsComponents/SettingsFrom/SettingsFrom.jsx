import { useEffect } from 'react';
import { Form, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import Input from '../../Helpers/Input/Input';
import CONSTANTS from '../../../constants';
import styles from './SettingsForm.module.css';

function SettingsForm({
  values,
  setFieldValue,
  dirty,
  isFetching,
  serverError,
  user,
}) {
  const { resetForm, submitCount, isValid } = useFormikContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (submitCount > 0 && !isFetching && !serverError && isValid) {
      navigate(CONSTANTS.APP_ROUTERS.PROFILE);
    }
  }, [isFetching, serverError, submitCount, isValid, navigate]);

  useEffect(() => {
    return () => {
      if (values.file && values.file instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(values.file));
      }
    };
  }, [values.file]);

  const handleCancel = () => {
    resetForm();
    navigate(CONSTANTS.APP_ROUTERS.PROFILE);
  };

  return (
    <Form className={styles.formLayout}>
      <div className={styles.avatarColumn}>
        <div className={styles.avatarPreviewWrapper}>
          <img
            src={
              values.file
                ? URL.createObjectURL(values.file)
                : user.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.PUBLIC_URL_AVATAR}${user.avatar}`
            }
            alt="Profile"
            className={styles.avatarImg}
          />
          <label htmlFor="avatar-input" className={styles.uploadOverlay}>
            <span>Change</span>
          </label>
        </div>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.currentTarget.files[0];
            if (file) setFieldValue('file', file);
          }}
        />
      </div>
      <div className={styles.inputsColumn}>
        <div className={styles.gridFields}>
          <Input name="firstName" placeholder="First Name" />
          <Input name="lastName" placeholder="Last Name" />
          <div className={styles.fullWidth}>
            <Input
              name="displayName"
              placeholder="Display Name (How others see you)"
            />
          </div>
          <div className={styles.fullWidth}>
            <Input name="email" type="email" placeholder="Email Address" />
          </div>
        </div>
        {serverError && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isFetching || !dirty}
          >
            {isFetching ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancel}
            disabled={isFetching}
          >
            Cancel
          </button>
        </div>
      </div>
    </Form>
  );
}

export default SettingsForm;
