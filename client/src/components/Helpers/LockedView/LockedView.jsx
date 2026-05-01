import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';
import CONSTANTS from '../../../constants';
import styles from './LockedView.module.css';

const LockedView = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const data = useMemo(() => {
    if (pathname === '/info') {
      return CONSTANTS.LOCKED_CONTENT?.INFO_PAGE;
    }
    if (pathname === '/tasks') {
      return CONSTANTS.LOCKED_CONTENT?.TASKS_PAGE;
    }
    if (pathname === '/work') {
      return CONSTANTS.LOCKED_CONTENT?.WORK_PAGE;
    }
    return CONSTANTS.LOCKED_CONTENT?.WORK_PAGE;
  }, [pathname]);

  if (!data) return null;

  const { title, statusText, buttonText, description, link } = data;

  return (
    <div className={styles.lockedOverlay}>
      <article className={styles.lockCard}>
        <div className={styles.lockIconWrapper}>
          <div className={styles.lockCircle}>
            <HiLockClosed className={styles.mainLockIcon} />
          </div>
          <span className={styles.lockStatus}>{statusText}</span>
        </div>
        <div className={styles.lockContent}>
          <h2 className={styles.lockedTitle}>{title}</h2>
          <div className={styles.lockedText}>{description}</div>
        </div>
        <button className={styles.primaryButton} onClick={() => navigate(link)}>
          {buttonText}
        </button>
      </article>
    </div>
  );
};

export default LockedView;
