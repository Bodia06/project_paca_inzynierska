import { useDispatch } from 'react-redux';
import { deleteVacancy } from '../../../../store/slices/vacancySlice';
import styles from './VacanciesEmployerListItem.module.css';

function VacanciesEmployerListItem({ vacancy, onEdit }) {
  const dispatch = useDispatch();

  const getStatusClass = (status) => {
    const classes = {
      paid: styles.statusPaid,
      completed: styles.statusCompleted,
    };
    return classes[status] || styles.statusOpen;
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete vacancy "${vacancy.title}"?`
      )
    ) {
      dispatch(deleteVacancy(vacancy.id));
    }
  };

  return (
    <li className={styles.InfoManagerListItemWrapper}>
      <div className={styles.infoBlock}>
        <span className={styles.language}>{vacancy.title}</span>
        <div className={styles.metaRow}>
          <span className={styles.version}>Budget: ${vacancy.price}</span>
          <span
            className={`${styles.statusBadge} ${getStatusClass(vacancy.status)}`}
          >
            {vacancy.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(vacancy)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default VacanciesEmployerListItem;
