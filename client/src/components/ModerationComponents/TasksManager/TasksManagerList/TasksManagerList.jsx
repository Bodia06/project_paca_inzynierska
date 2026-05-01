import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getTasks } from '../../../../store/slices/taskSlice';
import TasksManagerListItem from '../TasksManagerListItem/TasksManagerListItem';
import PaginationBtn from '../../../Helpers/PaginationBtn/PaginationBtn';
import Spinner from '../../../Helpers/Spinner/Spinner';
import styles from './TasksManagerList.module.css';

function TasksManagerList({ onEdit, filters, offset, setOffset, limit }) {
  const dispatch = useDispatch();
  const listTopRef = useRef(null);

  const {
    managerTasks: tasks = [],
    count = 0,
    isFetching,
    error,
    refreshCounter,
  } = useSelector((state) => state.task);

  const queryParams = useMemo(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v != null && v !== '')
    );
    return {
      ...activeFilters,
      limit: Number(limit),
      offset: Number(offset),
    };
  }, [filters, limit, offset]);

  useEffect(() => {
    dispatch(getTasks(queryParams));
  }, [dispatch, queryParams, refreshCounter]);

  useEffect(() => {
    if (!isFetching && tasks.length === 0 && offset > 0 && count > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
    }
  }, [tasks.length, offset, isFetching, count, limit, setOffset]);

  const handlePageChange = (newOffset) => {
    if (isFetching) return;
    setOffset(newOffset);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.container} ref={listTopRef}>
      {error && (
        <div className={styles.errorState}>
          {typeof error === 'object' ? error.message : error}
        </div>
      )}
      <div className={styles.listWrapper}>
        {isFetching && tasks.length === 0 ? (
          <div className={styles.loadingState}>
            <Spinner />
            <p className={styles.loadingText}>Searching for updates...</p>
          </div>
        ) : tasks.length > 0 ? (
          <ul className={styles.TasksManagerListWrapper}>
            {tasks.map((item) => (
              <TasksManagerListItem key={item.id} task={item} onEdit={onEdit} />
            ))}
          </ul>
        ) : (
          !isFetching && (
            <div className={styles.infoNoData}>
              <div className={styles.noDataIconContainer}>
                <FiSearch className={styles.noDataIcon} />
              </div>
              <p className={styles.noDataText}>No results found</p>
              <p className={styles.noDataSub}>Try adjusting your filters.</p>
            </div>
          )
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

export default TasksManagerList;
