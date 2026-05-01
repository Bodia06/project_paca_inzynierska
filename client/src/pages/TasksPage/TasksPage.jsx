import { useTasks } from '../../hooks/useTasks';
import Introduction from '../../components/Helpers/Introduction/Introduction';
import LockedView from '../../components/Helpers/LockedView/LockedView';
import Sidebar from '../../components/TasksComponents/Sidebar/Sidebar';
import TaskContent from '../../components/TasksComponents/TaskContent/TaskContent';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const {
    groupedTasks,
    progressPercentage,
    selectedTask,
    expandedModules,
    handleTaskSelect,
    toggleModule,
    user,
  } = useTasks();

  if (!user) return <Introduction />;

  const hasTasks = groupedTasks && Object.keys(groupedTasks).length > 0;

  if (!hasTasks) {
    return (
      <div className={styles.lockedPageWrapper}>
        <LockedView />
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <Sidebar
        groupedTasks={groupedTasks}
        progress={progressPercentage}
        selectedTaskId={selectedTask?.id}
        expandedModules={expandedModules}
        onTaskSelect={handleTaskSelect}
        onToggleModule={toggleModule}
      />
      <aside className={styles.content}>
        {selectedTask ? (
          <TaskContent />
        ) : (
          <div className={styles.placeholder}>
            <span>Please select a task from the sidebar to start.</span>
          </div>
        )}
      </aside>
    </section>
  );
}
