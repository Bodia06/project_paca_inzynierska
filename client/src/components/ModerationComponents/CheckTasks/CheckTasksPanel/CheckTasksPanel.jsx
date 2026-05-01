import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import {
  getPendingSubmissions,
  gradeSubmission,
} from '../../../../store/slices/submissionSlice';
import SubmissionCard from '../SubmissionCard/SubmissionCard';
import GradeModal from '../GradeModal/GradeModal';
import PaginationBtn from '../../../Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../../Helpers/Spinner/Spinner';
import CONSTANTS from '../../../../constants';
import styles from './CheckTasksPanel.module.css';

function CheckTasksPanel() {
  const dispatch = useDispatch();
  const listTopRef = useRef(null);
  const limit = CONSTANTS.TASK_SUBMISSION_PAGINATION || 4;

  const { pendingSubmissions, count, isFetching, error } = useSelector(
    (state) => state.submissions
  );

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [offset, setOffset] = useState(0);

  const isModalOpen = !!selectedSubmission;

  const fetchSubmissions = useCallback(
    (currentOffset) => {
      dispatch(getPendingSubmissions({ limit: limit, offset: currentOffset }));
    },
    [dispatch, limit]
  );

  useEffect(() => {
    fetchSubmissions(offset);
  }, [offset, fetchSubmissions]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const handlePageChange = (newOffset) => {
    if (isFetching) return;
    setOffset(newOffset);

    setTimeout(() => {
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 10);
  };

  const handleSubmitGrade = async (submissionId, data) => {
    const result = await dispatch(gradeSubmission({ submissionId, data }));

    if (gradeSubmission.fulfilled.match(result)) {
      handleCloseModal();

      if (pendingSubmissions.length === 1 && offset > 0) {
        handlePageChange(Math.max(0, offset - limit));
      } else {
        fetchSubmissions(offset);
      }
    }
  };

  return (
    <section className={styles.CheckTasksWrapper} ref={listTopRef}>
      <section className={isModalOpen ? styles.blurBackground : ''}>
        <div className={styles.panelHeader}>
          <div className={styles.textGroup}>
            <h2>Pending Submissions</h2>
            <p>Review and grade student solutions for active tasks</p>
          </div>
          <div className={styles.statsBadge}>
            Total Pending: <strong>{count}</strong>
          </div>
        </div>
        {error && (
          <section className={styles.errorBanner}>
            {typeof error === 'object' ? error.message : error}
          </section>
        )}
        <section className={styles.content}>
          <article className={styles.listContainer}>
            {isFetching && pendingSubmissions.length === 0 ? (
              <div className={styles.loadingState}>
                <Spinner />
                <p className={styles.loadingText}>Fetching submissions...</p>
              </div>
            ) : pendingSubmissions.length > 0 ? (
              <div className={styles.submissionsGrid}>
                {pendingSubmissions.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    onGrade={setSelectedSubmission}
                  />
                ))}
              </div>
            ) : (
              !isFetching && (
                <div className={styles.noDataState}>
                  <div className={styles.noDataIconContainer}>
                    <FiSearch className={styles.noDataIcon} />
                  </div>
                  <p className={styles.noDataText}>
                    No solutions submitted for tasks yet.
                  </p>
                </div>
              )
            )}
          </article>
          <PaginationBtn
            currentOffset={offset}
            limit={limit}
            count={count}
            isFetching={isFetching}
            onPageChange={handlePageChange}
          />
        </section>
      </section>
      {isModalOpen && (
        <section className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <GradeModal
              submission={selectedSubmission}
              isFetching={isFetching}
              onClose={handleCloseModal}
              onSubmit={handleSubmitGrade}
            />
          </div>
        </section>
      )}
    </section>
  );
}

export default CheckTasksPanel;
