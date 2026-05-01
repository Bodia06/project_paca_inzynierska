import { Formik, Form } from 'formik';
import Input from '../../Helpers/Input/Input';
import SCHEMAS from '../../../utils/validationSchems';
import styles from './SubmissionArea.module.css';

const SubmissionArea = ({
  currentSubmission,
  isFetching,
  error,
  onSubmit,
  taskId,
}) => {
  const getErrorMessage = (err) => {
    if (!err) return null;
    if (typeof err === 'string') return err;
    return err.message;
  };
  if (currentSubmission) {
    return (
      <div className={styles.statusCard}>
        <h3 className={styles.statusTitle}>Submission Status</h3>
        <p className={styles.linkInfo}>
          <strong>Link:</strong>{' '}
          <a
            href={currentSubmission.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            {currentSubmission.githubUrl}
          </a>
        </p>
        {currentSubmission.grade ? (
          <div className={styles.gradeResult}>
            <div className={styles.gradeBadge}>
              <span>Grade</span>
              <div className={styles.gradeValue}>
                {currentSubmission.grade} / 5
              </div>
            </div>
            {currentSubmission.feedback && (
              <div className={styles.feedbackBox}>
                <strong>Feedback:</strong>
                <p>{currentSubmission.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.pendingBadge}>Waiting for review...</div>
        )}
      </div>
    );
  }
  return (
    <article className={styles.formCard}>
      <h3 className={styles.statusTitle}>Send your solution</h3>
      {error && (
        <section className={styles.serverError}>
          <span className={styles.errorIcon}>✕</span>
          <span>{getErrorMessage(error)}</span>
        </section>
      )}
      <Formik
        initialValues={{ githubUrl: '', taskId: taskId }}
        enableReinitialize={true}
        validationSchema={SCHEMAS.SubmissionCreateSchema}
        onSubmit={(values) => {
          onSubmit(values.githubUrl);
        }}
      >
        <Form className={styles.subForm}>
          <Input
            name="githubUrl"
            type="url"
            placeholder="https://github.com/..."
          />
          <button type="submit" disabled={isFetching}>
            {isFetching ? 'Sending...' : 'Submit Solution'}
          </button>
        </Form>
      </Formik>
    </article>
  );
};

export default SubmissionArea;
