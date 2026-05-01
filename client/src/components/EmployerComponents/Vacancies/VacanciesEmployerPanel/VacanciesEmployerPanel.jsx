import { useState, useEffect } from 'react';
import VacanciesEmployerList from '../VacanciesEmployerList/VacanciesEmployerList';
import VacanciesForm from '../VacanciesForm/VacanciesForm';
import styles from './VacanciesEmployerPanel.module.css';

function VacanciesEmployerPanel() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);

  const [offset, setOffset] = useState(0);
  const limit = 4;

  const handleOpenForm = (vacancy = null) => {
    setEditingVacancy(vacancy);
    setIsFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVacancy(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section className={styles.InfoManagerPanelWrapper}>
      <article className={isFormOpen ? styles.blurBackground : ''}>
        <div className={styles.panelHeader}>
          <div className={styles.textGroup}>
            <h2>My Vacancies</h2>
            <p>Create and manage your active job offers and budget</p>
          </div>
          <button className={styles.createBtn} onClick={() => handleOpenForm()}>
            Post New Vacancy
          </button>
        </div>
        <section className={styles.panelContent}>
          <VacanciesEmployerList
            onEdit={handleOpenForm}
            offset={offset}
            setOffset={setOffset}
            limit={limit}
            myOnly="true"
          />
        </section>
      </article>
      {isFormOpen && (
        <aside className={styles.modalOverlay} onClick={handleCloseForm}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <VacanciesForm
              editingVacancy={editingVacancy}
              onCancel={handleCloseForm}
              onSuccess={handleCloseForm}
            />
          </div>
        </aside>
      )}
    </section>
  );
}

export default VacanciesEmployerPanel;
