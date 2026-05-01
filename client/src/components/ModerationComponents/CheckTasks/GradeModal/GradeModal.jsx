import { Formik, Form } from 'formik';
import { useSelector } from 'react-redux';
import Input from '../../../Helpers/Input/Input';
import SCHEMAS from '../../../../utils/validationSchems';
import styles from './GradeModal.module.css';

const GradeModal = ({ submission, onClose, onSubmit, isFetching }) => {
  const { error } = useSelector((state) => state.submissions);

  const initialValues = {
    grade: '',
    feedback: '',
  };

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    return error.message || 'Something went wrong';
  };

  const handleSubmit = (values) => {
    onSubmit(submission.id, values);
  };

  return (
    <section className={styles.formWrapper}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close form"
      />
      <h3 className={styles.formTitle}>Grade Submission</h3>
      <p className={styles.submissionInfo}>
        Reviewing: <strong>{submission.task?.title}</strong> <br />
        Student:{' '}
        <span>
          {submission.student?.firstName} {submission.student?.lastName}
        </span>
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={SCHEMAS.SubmissionGradeSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className={styles.formContainer}>
            {error && (
              <div className={styles.serverError}>
                <span>{renderError()}</span>
              </div>
            )}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Grade (0-5)</label>
              <Input
                name="grade"
                type="number"
                placeholder="Enter score (e.g. 5)"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Feedback</label>
              <Input
                as="textarea"
                name="feedback"
                placeholder="Provide detailed feedback..."
                className={styles.textArea}
              />
            </div>
            <div className={styles.buttonActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isFetching}
              >
                {isFetching ? 'Processing...' : 'Submit Grade'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default GradeModal;
