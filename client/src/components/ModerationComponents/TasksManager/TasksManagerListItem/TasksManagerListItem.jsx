import { useDispatch } from 'react-redux';
import { deleteTask } from '../../../../store/slices/taskSlice';
import styles from './TasksManagerListItem.module.css';

function TasksManagerListItem({ task, onEdit }) {
  const dispatch = useDispatch();

  const onDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the task: "${task.title}"?`
      )
    ) {
      dispatch(deleteTask(task.id));
    }
  };

  return (
    <li className={styles.TasksManagerListItemWrapper}>
      <div className={styles.infoBlock}>
        <span className={styles.title}>{task.title}</span>
        <span className={styles.moduleBadge}>Module: {task.modul}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TasksManagerListItem;
