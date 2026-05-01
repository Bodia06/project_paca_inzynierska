import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getInfo } from '../../../../store/slices/infoSlice';
import InfoManagerListItem from '../InfoManagerListItem/InfoManagerListItem';
import PaginationBtn from '../../../Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../../Helpers/Spinner/Spinner';
import styles from './InfoManagerList.module.css';

function InfoManagerList({ onEdit, filters, offset, setOffset, limit }) {
  const dispatch = useDispatch();
  const listTopRef = useRef(null);

  const { info, count, isFetching, error } = useSelector((state) => state.info);

  useEffect(() => {
    const params = {
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v != null)
      ),
      limit,
      offset,
    };
    dispatch(getInfo(params));
  }, [dispatch, filters, offset, limit]);

  useEffect(() => {
    if (offset > 0 && info.length === 0 && !isFetching && count > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
    }
  }, [info.length, offset, isFetching, count, limit, setOffset]);

  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container} ref={listTopRef}>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.listWrapper}>
        {isFetching ? (
          <div className={styles.loadingState}>
            <Spinner />
            <p className={styles.loadingText}>Searching for updates...</p>
          </div>
        ) : info.length > 0 ? (
          <ul className={styles.InfoManagerListWrapper}>
            {info.map((item) => (
              <InfoManagerListItem key={item.id} info={item} onEdit={onEdit} />
            ))}
          </ul>
        ) : (
          <div className={styles.infoNoData}>
            <div className={styles.noDataIconContainer}>
              <FiSearch className={styles.noDataIcon} />
            </div>
            <p className={styles.noDataText}>No results found</p>
            <p className={styles.noDataSub}>Try changing your filters.</p>
          </div>
        )}
      </div>
      <PaginationBtn
        currentOffset={offset}
        limit={limit}
        count={count}
        isFetching={isFetching}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default InfoManagerList;
