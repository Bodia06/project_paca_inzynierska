import styles from './SolutionDisplay.module.css';

const SolutionDisplay = ({ solution, onEdit, successMessage }) => {
  const isPending = solution.status === 'pending';

  return (
    <section className={styles.displayContainer}>
      {successMessage && (
        <div className={styles.successBadge}>
          <span className={styles.checkIcon}></span>
          {successMessage}
        </div>
      )}
      <section className={styles.contentBox}>
        <article className={styles.infoGroup}>
          <small className={styles.label}>Your GitHub Repository</small>
          <a
            href={solution.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkCard}
          >
            <span className={styles.linkText}>{solution.githubLink}</span>
            <span className={styles.externalIcon}></span>
          </a>
        </article>
        <article className={styles.statusSection}>
          <div className={styles.statusInfo}>
            <span
              className={`${styles.statusBadge} ${styles[solution.status]}`}
            >
              Status: {solution.status}
            </span>
            {isPending ? (
              <section className={styles.pendingAction}>
                <p className={styles.statusText}>
                  Your solution is being reviewed. You can still make changes.
                </p>
                <button className={styles.editBtn} onClick={onEdit}>
                  <span>Edit Solution</span>
                </button>
              </section>
            ) : (
              <p className={styles.statusText}>
                This solution has been marked as{' '}
                <strong>{solution.status}</strong> and can no longer be edited.
              </p>
            )}
          </div>
        </article>
      </section>
    </section>
  );
};

export default SolutionDisplay;
