import { Link } from 'react-router-dom';
import styles from './VacancyListItem.module.css';

export default function VacancyListItem({ vacancy }) {
  return (
    <li className={styles.vacancyListContainer}>
      <Link to={`/vacancies/${vacancy.id}`} className={styles.vacancyCardLink}>
        <article className={styles.vacancyCard}>
          <div className={styles.vacancyCardContent}>
            <div className={styles.vacancyTopRow}>
              <span className={styles.vacancyCategory}>
                Status: {vacancy.status}
              </span>
              <span className={styles.vacancyPrice}>{vacancy.price} USD</span>
            </div>
            <h3 className={styles.vacancyTitle}>{vacancy.title}</h3>
            <p className={styles.vacancyDescription}>
              {vacancy.description.length > 120
                ? `${vacancy.description.substring(0, 120)}...`
                : vacancy.description}
            </p>
          </div>
          <div className={styles.arrowWrapper}>
            <span className={styles.arrowRight}></span>
          </div>
        </article>
      </Link>
    </li>
  );
}
