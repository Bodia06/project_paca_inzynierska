import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import {
  acceptSolution,
  rejectSolution,
  clearSolutionStatus,
} from '../../../store/slices/solutionSlice';
import Spinner from '../../../components/Helpers/Spinner/Spinner';
import CONSTANTS from '../../../constants';
import styles from './SolutionsReviewPanel.module.css';

const SolutionsReviewPanel = () => {
  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { items: vacancies, isFetching: isVacanciesLoading } = useSelector(
    (state) => state.vacancies
  );

  const {
    successMessage,
    error,
    isFetching: isSolutionProcessing,
  } = useSelector((state) => state.solutions);

  useEffect(() => {
    return () => dispatch(clearSolutionStatus());
  }, [dispatch]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const solutionsToReview = useMemo(() => {
    let items = vacancies.reduce((acc, vacancy) => {
      if (vacancy.solutions && Array.isArray(vacancy.solutions)) {
        const mapped = vacancy.solutions
          .filter((sol) => sol.status === 'pending')
          .map((sol) => ({
            ...sol,
            vacancyTitle: vacancy.title,
            vacancyPrice: vacancy.price,
            developerName: sol.beginner?.displayName || 'Unknown',
          }));
        return [...acc, ...mapped];
      }
      return acc;
    }, []);

    if (sortConfig.key) {
      items.sort((a, b) => {
        const aValue = String(a[sortConfig.key]).toLowerCase();
        const bValue = String(b[sortConfig.key]).toLowerCase();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [vacancies, sortConfig]);

  const handleAccept = (id) => {
    if (window.confirm('Accept this solution and close the vacancy?')) {
      dispatch(acceptSolution(id));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this solution?')) {
      dispatch(rejectSolution(id));
    }
  };

  const getAvatarUrl = (avatar) =>
    !avatar || avatar === 'anon.png'
      ? CONSTANTS.ANONYM_IMAGE_PATH
      : `${CONSTANTS.PUBLIC_URL_AVATAR}${avatar}`;

  const renderSortLabel = (key, label) => (
    <div className={styles.sortLabelWrapper}>
      {label}
      <span className={styles.sortIndicator}>
        {sortConfig.key === key
          ? sortConfig.direction === 'asc'
            ? ' (ASC)'
            : ' (DESC)'
          : ''}
      </span>
    </div>
  );

  return (
    <div className={styles.InfoManagerPanelWrapper}>
      <div className={styles.containerMaxWidth}>
        <div className={styles.panelHeader}>
          <div className={styles.textGroup}>
            <h2>Solutions Check</h2>
            <p>Pending work from beginners that requires your decision</p>
          </div>
          <div className={styles.statsBadge}>
            Pending: <strong>{solutionsToReview.length}</strong>
          </div>
        </div>
        <section className={styles.panelContent}>
          {successMessage && (
            <div className={styles.successBanner}>{successMessage}</div>
          )}
          {error && <div className={styles.errorBanner}>{String(error)}</div>}

          {isVacanciesLoading && vacancies.length === 0 ? (
            <section className={styles.loadingState}>
              <Spinner />
              <p className={styles.loadingText}>Loading solutions...</p>
            </section>
          ) : solutionsToReview.length === 0 ? (
            <section className={styles.noDataState}>
              <div className={styles.noDataIconContainer}>
                <FiSearch className={styles.noDataIcon} />
              </div>
              <h3 className={styles.noDataText}>No vacancies found</h3>
              <p className={styles.noDataSub}>
                Try changing your search criteria or check back later.
              </p>
            </section>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.reviewTable}>
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort('vacancyTitle')}
                      className={styles.sortable}
                    >
                      {renderSortLabel('vacancyTitle', 'Vacancy')}
                    </th>
                    <th
                      onClick={() => handleSort('developerName')}
                      className={styles.sortable}
                    >
                      {renderSortLabel('developerName', 'Developer')}
                    </th>
                    <th>Repository</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {solutionsToReview.map((solution) => (
                    <tr key={solution.id}>
                      <td>
                        <div className={styles.vacancyCell}>
                          <span className={styles.vTitle}>
                            {solution.vacancyTitle}
                          </span>
                          <span className={styles.vPrice}>
                            {solution.vacancyPrice} USD
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={getAvatarUrl(solution.beginner?.avatar)}
                            alt="avatar"
                          />
                          <span>{solution.developerName}</span>
                        </div>
                      </td>
                      <td>
                        <a
                          href={solution.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.repoLink}
                        >
                          Open Code
                        </a>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${styles.pending}`}
                        >
                          {solution.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button
                            className={styles.acceptBtn}
                            onClick={() => handleAccept(solution.id)}
                            disabled={isSolutionProcessing}
                          >
                            Accept
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleReject(solution.id)}
                            disabled={isSolutionProcessing}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SolutionsReviewPanel;
