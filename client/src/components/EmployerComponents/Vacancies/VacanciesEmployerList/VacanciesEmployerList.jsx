import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import { fetchVacancies } from '../../../../store/slices/vacancySlice';
import VacanciesEmployerListItem from '../VacanciesEmployerListItem/VacanciesEmployerListItem';
import PaginationBtn from '../../../Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../../Helpers/Spinner/Spinner';
import styles from './VacanciesEmployerList.module.css';

function VacanciesEmployerList({ onEdit, offset, setOffset, limit, myOnly }) {
  const dispatch = useDispatch();
  const listTopRef = useRef(null);

  const { items, count, isFetching, error } = useSelector(
    (state) => state.vacancies
  );

  useEffect(() => {
    const params = {
      limit,
      offset,
      myOnly: myOnly || undefined,
    };
    dispatch(fetchVacancies(params));
  }, [dispatch, offset, limit, myOnly]);

  useEffect(() => {
    if (offset > 0 && items.length === 0 && !isFetching && count > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
    }
  }, [items.length, offset, isFetching, count, limit, setOffset]);

  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={styles.container} ref={listTopRef}>
      {error && !isFetching && (
        <div className={styles.errorState}>
          {typeof error === 'string' ? error : 'Error loading vacancies'}
        </div>
      )}

      <section className={styles.listWrapper}>
        {isFetching ? (
          <section className={styles.loadingState}>
            <Spinner />
            <p className={styles.loadingText}>Fetching your vacancies...</p>
          </section>
        ) : items.length > 0 ? (
          <ul className={styles.InfoManagerListWrapper}>
            {items.map((item) => (
              <VacanciesEmployerListItem
                key={item.id}
                vacancy={item}
                onEdit={onEdit}
              />
            ))}
          </ul>
        ) : (
          <section className={styles.infoNoData}>
            <div className={styles.noDataIconContainer}>
              <FiSearch className={styles.noDataIcon} />
            </div>
            <p className={styles.noDataText}>
              {myOnly
                ? "You haven't created any vacancies yet"
                : 'No vacancies found'}
            </p>
            <p className={styles.noDataSub}>
              {myOnly
                ? "Click 'Create Vacancy' to start hiring."
                : 'Try changing your search criteria.'}
            </p>
          </section>
        )}
      </section>
      <PaginationBtn
        currentOffset={offset}
        limit={limit}
        count={count}
        isFetching={isFetching}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default VacanciesEmployerList;
