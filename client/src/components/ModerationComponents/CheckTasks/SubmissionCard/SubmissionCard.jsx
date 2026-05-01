import styles from './SubmissionCard.module.css';

const SubmissionCard = ({ sub, onGrade }) => (
  <section className={styles.submissionCard}>
    <article className={styles.cardHeader}>
      <span className={styles.taskTitle}>
        {sub.task?.title || 'Untitled Task'}
      </span>
      <a
        href={sub.githubUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.githubLink}
      >
        View Code
      </a>
    </article>
    <article className={styles.studentInfo}>
      <div className={styles.avatar}>
        {sub.student?.firstName?.[0]}
        {sub.student?.lastName?.[0]}
      </div>
      <div className={styles.details}>
        <p className={styles.studentName}>
          {sub.student?.firstName} {sub.student?.lastName}
        </p>
        <p className={styles.studentEmail}>{sub.student?.email}</p>
      </div>
    </article>
    <button className={styles.gradeBtn} onClick={() => onGrade(sub)}>
      Grade Submission
    </button>
  </section>
);

export default SubmissionCard;
