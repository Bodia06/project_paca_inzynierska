import { useState } from 'react';
import InfoManagerPanel from '../../components/ModerationComponents/InfoManager/InfoManagerPanel/InfoManagerPanel';
import TasksManagerPanel from '../../components/ModerationComponents/TasksManager/TasksManagerPanel/TasksManagerPanel';
import CheckTasksPanel from '../../components/ModerationComponents/CheckTasks/CheckTasksPanel/CheckTasksPanel';
import styles from './ModerationPage.module.css';

function ModerationPage() {
  const [activeTab, setActiveTab] = useState('updates');

  return (
    <section className={styles.moderationPageWrapper}>
      <aside className={styles.sidebar}>
        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeTab === 'updates' ? styles.active : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            <span className={styles.linkText}>Update Management</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'tasks' ? styles.active : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <span className={styles.linkText}>Tasks Control</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'check' ? styles.active : ''}`}
            onClick={() => setActiveTab('check')}
          >
            <span className={styles.linkText}>Check tasks</span>
          </button>
        </nav>
      </aside>
      <section className={styles.contentArea}>
        {activeTab === 'updates' && <InfoManagerPanel />}
        {activeTab === 'tasks' && <TasksManagerPanel />}
        {activeTab === 'check' && <CheckTasksPanel />}
      </section>
    </section>
  );
}

export default ModerationPage;
