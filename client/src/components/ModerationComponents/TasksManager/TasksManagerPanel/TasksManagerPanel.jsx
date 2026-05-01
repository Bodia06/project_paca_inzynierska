import { useState, useEffect } from 'react';
import classNames from 'classnames';
import TasksManagerList from '../TasksManagerList/TasksManagerList';
import TasksForm from '../TasksForm/TasksForm';
import BaseFilter from '../../../Helpers/BaseFilter/BaseFilter';
import CONSTANTS from '../../../../constants';
import styles from './TasksManagerPanel.module.css';

function TasksManagerPanel() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [offset, setOffset] = useState(0);
  const limit = CONSTANTS.TASKS_LIMIT_PAGINATION;

  const handleOpenForm = (task = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    document.body.style.overflow = 'auto';
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    setOffset(0);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const contentClasses = classNames({
    [styles.blurBackground]: isFormOpen,
  });

  return (
    <div className={styles.TasksManagerPanelWrapper}>
      <div className={contentClasses}>
        <div className={styles.panelHeader}>
          <div className={styles.textGroup}>
            <h2>Tasks Management</h2>
            <p>Create, update, or archive learning assignments for beginners</p>
          </div>
          <button className={styles.createBtn} onClick={() => handleOpenForm()}>
            Create New Task
          </button>
        </div>
        <div className={styles.mainLayout}>
          <div className={styles.filterSection}>
            <BaseFilter
              title="Task Filters"
              subtitle="Find specific assignments"
              fields={CONSTANTS.FILTER_DATA.taskFields}
              initialValues={activeFilters}
              onFilterApply={handleFilterApply}
            />
          </div>
          <section className={styles.panelContent}>
            <TasksManagerList
              onEdit={handleOpenForm}
              filters={activeFilters}
              offset={offset}
              setOffset={setOffset}
              limit={limit}
            />
          </section>
        </div>
      </div>
      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <TasksForm
              editingTask={editingTask}
              onCancel={handleCloseForm}
              setOffset={setOffset}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksManagerPanel;
