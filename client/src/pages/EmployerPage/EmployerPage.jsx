import { useState } from 'react';
import VacanciesEmployerPanel from '../../components/EmployerComponents/Vacancies/VacanciesEmployerPanel/VacanciesEmployerPanel';
import SolutionsReviewPanel from '../../components/EmployerComponents/SolutionsReviewPanel/SolutionsReviewPanel';
import styles from './EmployerPage.module.css';

function EmployerPage() {
  const [activeTab, setActiveTab] = useState('vacancies');

  return (
    <section className={styles.employerPageWrapper}>
      <aside className={styles.sidebar}>
        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeTab === 'vacancies' ? styles.active : ''}`}
            onClick={() => setActiveTab('vacancies')}
          >
            <span className={styles.linkText}>Vacancies</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'check' ? styles.active : ''}`}
            onClick={() => setActiveTab('check')}
          >
            <span className={styles.linkText}>Vacancies Check</span>
          </button>
        </nav>
      </aside>
      <section className={styles.contentArea}>
        {activeTab === 'vacancies' && <VacanciesEmployerPanel />}
        {activeTab === 'check' && <SolutionsReviewPanel />}
      </section>
    </section>
  );
}

export default EmployerPage;
