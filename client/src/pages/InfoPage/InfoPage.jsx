import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useQueryParams,
  StringParam,
  NumberParam,
  withDefault,
} from 'use-query-params';
import { FiSearch } from 'react-icons/fi';
import { getInfo } from '../../store/slices/infoSlice';
import Introduction from '../../components/Helpers/Introduction/Introduction';
import BaseFilter from '../../components/Helpers/BaseFilter/BaseFilter';
import InfoListItem from '../../components/InfoComponents/InfoListItem/InfoListItem';
import LockedView from '../../components/Helpers/LockedView/LockedView';
import PaginationBtn from '../../components/Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../components/Helpers/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './InfoPage.module.css';

function InfoPage() {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const limit = CONSTANTS.INFO_LIMIT_PAGINATION || 4;

  const [query, setQuery] = useQueryParams({
    id: StringParam,
    languageName: StringParam,
    version: StringParam,
    offset: withDefault(NumberParam, 0),
  });

  const { info, count, isFetching, error } = useSelector((state) => state.info);
  const { user } = useSelector((state) => state.user);

  const canLoadData = !!user;
  const currentOffset = query.offset || 0;
  const isFiltering = !!(query.id || query.languageName || query.version);

  useEffect(() => {
    if (canLoadData) {
      const params = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v != null && v !== '')
      );
      dispatch(getInfo({ ...params, limit }));
    }
  }, [dispatch, canLoadData, query, limit]);

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
  if (info.length === 0 && !isFetching && !isFiltering && currentOffset === 0) {
    return <LockedView />;
  }

  return (
    <section className={styles.infoPageWrapper}>
      <div className={styles.mainContainer}>
        <section className={styles.mainLayout}>
          <aside className={styles.filterSection}>
            <BaseFilter
              title="Filters"
              subtitle="Refine your search results"
              fields={CONSTANTS.FILTER_DATA.infoFields}
              onFilterApply={handleFilterApply}
            />
          </aside>
          <section className={styles.contentSection} ref={contentRef}>
            <div className={styles.listWrapper}>
              {isFetching ? (
                <section className={styles.loadingState}>
                  <Spinner />
                  <p className={styles.loadingText}>
                    Scanning database for updates...
                  </p>
                </section>
              ) : info.length > 0 ? (
                <ul className={styles.infoList}>
                  {info.map((item) => (
                    <InfoListItem key={item.id} info={item} />
                  ))}
                </ul>
              ) : (
                <div className={styles.noDataState}>
                  <div className={styles.noDataIconContainer}>
                    <FiSearch className={styles.noDataIcon} />
                  </div>
                  <h3 className={styles.noDataText}>
                    {error ? 'Sync failed' : 'No results found'}
                  </h3>
                  <p className={styles.noDataSub}>
                    Try adjusting your filters or search terms.
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
        </section>
      </div>
    </section>
  );
}

export default InfoPage;
