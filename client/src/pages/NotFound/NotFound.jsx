import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <section className={styles.notFoundWrapper}>
      <div className={styles.bgGlow} />

      <div className={styles.contentCard}>
        <div className={styles.errorHeader}>
          <div className={styles.iconContainer}>
            <AlertCircle size={48} strokeWidth={1.5} />
          </div>
          <h1 className={styles.errorCode}>404</h1>
        </div>

        <div className={styles.textGroup}>
          <h2 className={styles.title}>System Error: Path Not Found</h2>
          <p className={styles.description}>
            The coordinates you are looking for do not exist in our database.
            The page may have been moved, deleted, or never existed.
          </p>
        </div>

        <Link to="/" className={styles.homeBtn}>
          <Home size={20} />
          <span>Back to Base</span>
        </Link>
      </div>

      <div className={styles.visualDecor}>
        <div className={styles.orbit} />
        <div className={styles.glitchLine} />
      </div>
    </section>
  );
}

export default NotFound;
