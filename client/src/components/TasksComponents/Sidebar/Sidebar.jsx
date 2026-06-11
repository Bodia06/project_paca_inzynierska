import { memo, useState, useEffect, useMemo } from 'react';
import { BookOpen, Layout, Menu, X, Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
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

    const toggleSidebar = () => setIsOpen(!isOpen);

    const filteredGroupedTasks = useMemo(() => {
      if (!searchQuery.trim()) return groupedTasks;

      const query = searchQuery.toLowerCase().trim();
      const filtered = {};

      Object.keys(groupedTasks).forEach((moduleKey) => {
        if (moduleKey.toLowerCase().includes(query)) {
          filtered[moduleKey] = groupedTasks[moduleKey];
        }
      });

      return filtered;
    }, [groupedTasks, searchQuery]);

    const hasModules = Object.keys(filteredGroupedTasks).length > 0;

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
          {user?.role === CONSTANTS.BEGINNER_ROLE &&
            Object.keys(groupedTasks).length > 0 && (
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
          <article className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </article>
          <nav className={styles.programNav}>
            <div className={styles.navHeader}>
              <Layout size={18} />
              <span className={styles.navTitle}>Course Syllabus</span>
            </div>
            <article className={styles.modulesList}>
              {hasModules ? (
                Object.keys(filteredGroupedTasks)
                  .sort()
                  .map((moduleKey, index) => (
                    <ModuleItem
                      key={moduleKey}
                      indexNum={index + 1}
                      moduleTitle={moduleKey}
                      tasks={filteredGroupedTasks[moduleKey]}
                      selectedTaskId={selectedTaskId}
                      isExpanded={!!expandedModules[moduleKey] || !!searchQuery}
                      onToggle={() => onToggleModule(moduleKey)}
                      isCollapsed={false}
                      onTaskSelect={onTaskSelect}
                    />
                  ))
              ) : (
                <div className={styles.emptyState}>
                  {searchQuery
                    ? 'No modules match your search'
                    : 'No modules found'}
                </div>
              )}
            </article>
          </nav>
        </section>
      </aside>
    );
  }
);

export default Sidebar;
