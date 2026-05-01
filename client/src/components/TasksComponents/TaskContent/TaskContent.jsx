import { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useTasks } from '../../../hooks/useTasks';
import {
  createSubmission,
  clearSubmissionError,
} from '../../../store/slices/submissionSlice';
import TaskHeader from '../TaskHeader/TaskHeader';
import SubmissionArea from '../SubmissionArea/SubmissionArea';
import CONSTANTS from '../../../constants';
import styles from './TaskContent.module.css';

const TaskContent = memo(() => {
  const dispatch = useDispatch();
  const {
    selectedTask: task,
    tasks,
    currentSubmission,
    gradesLoading,
    error,
    user,
    handleTaskSelect,
  } = useTasks();

  const isBeginner = user?.role === CONSTANTS.BEGINNER_ROLE;
  const currentIndex = tasks.findIndex(
    (t) => Number(t.id) === Number(task?.id)
  );

  const authorAvatar =
    user?.avatar && user.avatar !== 'anon.png'
      ? `${CONSTANTS.PUBLIC_URL_AVATAR}${user.avatar}`
      : CONSTANTS.ANONYM_IMAGE_PATH;

  useEffect(() => {
    dispatch(clearSubmissionError());
  }, [dispatch, task?.id]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = tasks[currentIndex - 1];
      handleTaskSelect(prev.id, prev.modul);
    }
  };

  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      const next = tasks[currentIndex + 1];
      handleTaskSelect(next.id, next.modul);
    }
  };

  return (
    <section>
      <TaskHeader
        title={task.title}
        modul={task.modul}
        onPrev={handlePrev}
        onNext={handleNext}
        isFirst={currentIndex === 0}
        isLast={currentIndex === tasks.length - 1}
      />
      <article className={styles.contentLayout}>
        <section className={styles.details}>
          <div className={styles.contentHeader}>
            <h3 className={styles.mainTitle}>{task.title}</h3>
            {task.moderator && (
              <div className={styles.authorCard}>
                <img
                  src={authorAvatar}
                  alt="User Image"
                  className={styles.authorAvatarImg}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>
                    {task.moderator.firstName} {task.moderator.lastName}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.descriptionText}>{task.description}</div>
        </section>
        {isBeginner && (
          <aside className={styles.sidePanel}>
            <SubmissionArea
              currentSubmission={currentSubmission}
              isFetching={gradesLoading}
              taskId={task.id}
              error={error}
              onSubmit={(url) =>
                dispatch(createSubmission({ taskId: task.id, githubUrl: url }))
              }
            />
          </aside>
        )}
      </article>
    </section>
  );
});

export default TaskContent;
