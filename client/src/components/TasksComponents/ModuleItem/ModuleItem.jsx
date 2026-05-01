import { useTasks } from '../../../hooks/useTasks';
import CONSTANTS from '../../../constants';
import styles from './ModuleItem.module.css';

const ModuleItem = ({
  indexNum,
  moduleTitle,
  tasks,
  selectedTaskId,
  isExpanded,
  onToggle,
  onTaskSelect,
}) => {
  const { user } = useTasks();

  const isBeginner = user?.role === CONSTANTS.BEGINNER_ROLE;

  return (
    <section
      className={`${styles.moduleBox} ${isExpanded ? styles.expanded : ''}`}
    >
      <section className={styles.moduleHeader} onClick={onToggle}>
        <div className={styles.moduleBadge}>{indexNum}</div>
        <span className={styles.moduleTitle}>{moduleTitle}</span>
        <span
          className={`${styles.chevron} ${isExpanded ? styles.chevronActive : ''}`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </section>
      {isExpanded && (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`
                ${styles.taskItem} 
                ${Number(selectedTaskId) === Number(task.id) ? styles.activeTask : ''} 
                ${task.isCompleted ? styles.completedTask : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                onTaskSelect(task.id, moduleTitle);
              }}
            >
              {isBeginner && (
                <section
                  className={`${styles.statusCheck} ${task.isCompleted ? styles.completed : styles.pending}`}
                >
                  {task.isCompleted && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </section>
              )}
              <div className={styles.taskMeta}>
                <span className={styles.taskCategory}>TASK</span>
                <span className={styles.taskName}>{task.title}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ModuleItem;
