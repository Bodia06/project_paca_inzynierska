import { memo, useState, useEffect } from 'react';
import { BookOpen, Layout, Menu, X } from 'lucide-react';
import { useTasks } from '../../../hooks/useTasks';
import ModuleItem from '../ModuleItem/ModuleItem';
import CONSTANTS from '../../../constants';
import styles from './Sidebar.module.css';

const Sidebar = memo(
  ({
    groupedTasks,
    progress,
    selectedTaskId,
    onTaskSelect,
    expandedModules,
    onToggleModule,
  }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { user } = useTasks();

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 1100) {
          setIsOpen(true);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const hasModules = Object.keys(groupedTasks).length > 0;
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
      <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
        <button
          className={styles.mobileToggleBtn}
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <section className={styles.sidebarContent}>
          <article className={styles.header}>
            <div className={styles.logoArea}>
              <div className={styles.iconBox}>
                <BookOpen size={22} className={styles.brandIcon} />
              </div>
              <span className={styles.brandName}>Learning Hub</span>
            </div>
          </article>
          {user?.role === CONSTANTS.BEGINNER_ROLE && hasModules && (
            <article className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>My Progress</span>
                <span className={styles.progressValue}>{progress}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </article>
          )}
          <nav className={styles.programNav}>
            <div className={styles.navHeader}>
              <Layout size={18} />
              <span className={styles.navTitle}>Course Syllabus</span>
            </div>
            <article className={styles.modulesList}>
              {hasModules ? (
                Object.keys(groupedTasks)
                  .sort()
                  .map((moduleKey, index) => (
                    <ModuleItem
                      key={moduleKey}
                      indexNum={index + 1}
                      moduleTitle={moduleKey}
                      tasks={groupedTasks[moduleKey]}
                      selectedTaskId={selectedTaskId}
                      isExpanded={!!expandedModules[moduleKey]}
                      onToggle={() => onToggleModule(moduleKey)}
                      isCollapsed={false}
                      onTaskSelect={onTaskSelect}
                    />
                  ))
              ) : (
                <div className={styles.emptyState}>No modules found</div>
              )}
            </article>
          </nav>
        </section>
      </aside>
    );
  }
);

export default Sidebar;
