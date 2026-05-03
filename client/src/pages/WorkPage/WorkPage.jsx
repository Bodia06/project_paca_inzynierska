import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useQueryParams,
  StringParam,
  NumberParam,
  withDefault,
} from 'use-query-params';
import { FiSearch } from 'react-icons/fi';
import { fetchVacancies } from '../../store/slices/vacancySlice';
import { useTasks } from '../../hooks/useTasks';
import Introduction from '../../components/Helpers/Introduction/Introduction';
import BaseFilter from '../../components/Helpers/BaseFilter/BaseFilter';
import VacancyListItem from '../../components/WorkComponents/VacancyListItem/VacancyListItem';
import LockedView from '../../components/Helpers/LockedView/LockedView';
import PaginationBtn from '../../components/Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../components/Helpers/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './WorkPage.module.css';

function WorkPage() {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const limit = CONSTANTS.VACANCIES_LIMIT_PAGINATION || 4;

  const [query, setQuery] = useQueryParams({
    title: StringParam,
    status: StringParam,
    minPrice: NumberParam,
    offset: withDefault(NumberParam, 0),
  });

  const {
    items: vacancies,
    count,
    isFetching,
    error,
  } = useSelector((state) => state.vacancies);
  const { user } = useSelector((state) => state.user);
  const { isAllTasksCompleted } = useTasks();

  const isAccessDenied =
    user?.role === CONSTANTS.BEGINNER_ROLE && !isAllTasksCompleted;
  const isFiltering = !!(query.title || query.status || query.minPrice);
  const currentOffset = query.offset || 0;

  useEffect(() => {
    if (user && !isAccessDenied) {
      const params = {
        title: query.title || undefined,
        status: query.status || undefined,
        minPrice: query.minPrice || undefined,
        limit,
        offset: currentOffset,
      };
      dispatch(fetchVacancies(params));
    }
  }, [dispatch, user, isAccessDenied, query, limit, currentOffset]);

  const handlePageChange = (newOffset) => {
    if (isFetching) return;
    setQuery({ offset: newOffset }, 'pushIn');

    if (contentRef.current) {
      const yOffset = -120;
      const y =
        contentRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleFilterApply = (newFilters) => {
    setQuery({ ...newFilters, offset: 0 });
  };

  if (!user) return <Introduction />;

  if (
    vacancies.length === 0 &&
    !isFetching &&
    !isFiltering &&
    currentOffset === 0
  ) {
    return <LockedView />;
  }

  return (
    <section className={styles.workPageWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.mainLayout}>
          <aside className={styles.filterSection}>
            <BaseFilter
              title="Filters"
              subtitle="Refine vacancy results"
              fields={CONSTANTS.FILTER_DATA.vacancyFields}
              initialValues={query}
              onFilterApply={handleFilterApply}
            />
          </aside>
          <section className={styles.contentSection} ref={contentRef}>
            <div className={styles.listWrapper}>
              {isFetching ? (
                <div className={styles.loadingState}>
                  <Spinner />
                  <p className={styles.loadingText}>
                    Scanning career opportunities...
                  </p>
                </div>
              ) : vacancies.length > 0 ? (
                <ul className={styles.vacancyList}>
                  {vacancies.map((vacancy) => (
                    <VacancyListItem key={vacancy.id} vacancy={vacancy} />
                  ))}
                </ul>
              ) : (
                <div className={styles.noDataState}>
                  <div className={styles.noDataIconContainer}>
                    <FiSearch className={styles.noDataIcon} />
                  </div>
                  <h3 className={styles.noDataText}>
                    {error ? 'Failed to load vacancies' : 'No vacancies found'}
                  </h3>
                  <p className={styles.noDataSub}>
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
            <PaginationBtn
              currentOffset={currentOffset}
              limit={limit}
              count={count}
              isFetching={isFetching}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </div>
    </section>
  );
}

export default WorkPage;
