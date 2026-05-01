import { useState, useEffect } from 'react';
import classNames from 'classnames';
import InfoManagerList from '../InfoManagerList/InfoManagerList';
import InfoForm from '../InfoForm/InfoForm';
import BaseFilter from '../../../Helpers/BaseFilter/BaseFilter';
import CONSTANTS from '../../../../constants';
import styles from './InfoManagerPanel.module.css';

function InfoManagerPanel() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [offset, setOffset] = useState(0);
  const limit = CONSTANTS.INFO_LIMIT_PAGINATION;

  const handleOpenForm = (info = null) => {
    setEditingInfo(info);
    setIsFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInfo(null);
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
    <div className={styles.InfoManagerPanelWrapper}>
      <div className={contentClasses}>
        <div className={styles.panelHeader}>
          <div className={styles.textGroup}>
            <h2>Updates Management</h2>
            <p>Create, edit, or remove information language update logs</p>
          </div>
          <button className={styles.createBtn} onClick={() => handleOpenForm()}>
            Create New Entry
          </button>
        </div>
        <div className={styles.mainLayout}>
          <BaseFilter
            title="Filters"
            subtitle="Refine your search results"
            fields={CONSTANTS.FILTER_DATA.infoFields}
            onFilterApply={handleFilterApply}
          />
          <section className={styles.panelContent}>
            <InfoManagerList
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
            <InfoForm editingInfo={editingInfo} onCancel={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoManagerPanel;
