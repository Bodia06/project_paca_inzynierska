import { useDispatch } from 'react-redux';
import { deleteInfo } from '../../../../store/slices/infoSlice';
import styles from './InfoManagerListItem.module.css';

function InfoManagerListItem({ info, onEdit }) {
  const dispatch = useDispatch();

  const onDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the ${info.languageName} update?`
      )
    ) {
      dispatch(deleteInfo(info.id));
    }
  };

  return (
    <li className={styles.InfoManagerListItemWrapper}>
      <div className={styles.infoBlock}>
        <span className={styles.language}>{info.languageName}</span>
        <span className={styles.version}>Release: {info.version}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(info)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default InfoManagerListItem;
