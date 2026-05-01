import styles from './PaginationBtn.module.css';

const PaginationBtn = ({
  currentOffset,
  limit,
  count,
  isFetching,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / limit) || 1;
  const currentPage = Math.floor(currentOffset / limit) + 1;

  if (count <= limit) return null;

  return (
    <div className={styles.paginationFooter}>
      <div className={styles.paginationControls}>
        <button
          className={styles.navBtn}
          disabled={currentOffset <= 0 || isFetching}
          onClick={() => onPageChange(currentOffset - limit)}
        >
          <span className={styles.arrowLeft}></span>
          <span>Previous</span>
        </button>
        <div className={styles.pageIndicator}>
          Page <span>{currentPage}</span> of {totalPages}
        </div>
        <button
          className={styles.navBtn}
          disabled={currentOffset + limit >= count || isFetching}
          onClick={() => onPageChange(currentOffset + limit)}
        >
          <span>Next</span>
          <span className={styles.arrowRight}></span>
        </button>
      </div>
    </div>
  );
};

export default PaginationBtn;
