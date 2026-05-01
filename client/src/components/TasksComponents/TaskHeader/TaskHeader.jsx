import styles from './TaskHeader.module.css';

const TaskHeader = ({ title, modul, onPrev, onNext, isFirst, isLast }) => (
  <section className={styles.contentHeader}>
    <button
      className={`${styles.arrowBtn} ${styles.prev}`}
      onClick={onPrev}
      disabled={isFirst}
      aria-label="Previous Task"
    />
    <div className={styles.headerInfo}>
      <div className={styles.moduleBadge}>{modul}</div>
      <h3 className={styles.title}>{title}</h3>
    </div>
    <button
      className={`${styles.arrowBtn} ${styles.next}`}
      onClick={onNext}
      disabled={isLast}
      aria-label="Next Task"
    />
  </section>
);

export default TaskHeader;
