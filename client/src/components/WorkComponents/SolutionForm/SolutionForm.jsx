import { Formik, Form, Field, ErrorMessage } from 'formik';
import SCHEMAS from '../../../utils/validationSchems';
import styles from './SolutionForm.module.css';

const SolutionForm = ({
  initialLink,
  isSending,
  error,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  return (
    <Formik
      initialValues={{ githubLink: initialLink || '' }}
      enableReinitialize={true}
      validationSchema={
        isEditing ? SCHEMAS.SolutionUpdateSchema : SCHEMAS.SolutionCreateSchema
      }
      onSubmit={onSubmit}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form className={styles.solutionForm}>
          <div className={styles.inputField}>
            <label htmlFor="githubLink" className={styles.label}>
              Repository URL
            </label>
            <div className={styles.inputWrapper}>
              <Field
                name="githubLink"
                id="githubLink"
                placeholder="https://github.com/username/repo"
                className={`${styles.input} ${
                  errors.githubLink && touched.githubLink
                    ? styles.inputError
                    : ''
                }`}
              />
              <div className={styles.inputFocusLine}></div>
            </div>
            <ErrorMessage
              name="githubLink"
              component="div"
              className={styles.errorText}
            />
          </div>
          {error && <div className={styles.serverError}>{error}</div>}
          <div className={styles.actionButtons}>
            <button
              type="submit"
              className={styles.applyBtn}
              disabled={isSending || !isValid || !dirty}
            >
              <span className={styles.btnContent}>
                {isSending
                  ? 'Sending...'
                  : initialLink
                    ? 'Save Changes'
                    : 'Submit Solution'}
              </span>
            </button>
            {(isEditing || initialLink) && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SolutionForm;
