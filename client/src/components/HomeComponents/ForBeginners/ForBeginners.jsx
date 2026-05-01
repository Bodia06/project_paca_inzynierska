import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from './ForBeginners.module.css';

function ForBeginners({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <section className={styles.forBeginnersSection}>
      <div className={styles.forBeginnersContainer}>
        <div className={styles.imageWrapper}>
          <img
            src={CONSTANTS.BEGINNER_HOME_IMAGE_PATH}
            alt="Beginner Image"
            className={styles.beginnerImg}
          />
        </div>
        <div className={styles.forBeginnersInfo}>
          <span className={styles.subTitle}>START JOURNEY</span>
          <h2 className={styles.title}>For Beginners</h2>
          <p className={styles.text}>
            If you are a beginner, you are in luck! This is where you can learn
            programming from scratch. All tasks that you will perform are
            checked by <strong>moderators</strong> who provide detailed
            feedback.
          </p>
          <div className={styles.highlightBox}>
            <p>
              After completing the training, the <strong>“Work” tab</strong>{' '}
              will open for you, where you can take on real projects and get
              paid.
            </p>
          </div>
          <div className={styles.btnWrapper}>
            {isLoggedIn ? (
              <div className={styles.welcomeUserBadge}>
                You are on the right track!
              </div>
            ) : (
              <button
                className={styles.startBtn}
                onClick={() =>
                  navigate(CONSTANTS.APP_ROUTERS.REGISTRATION_BEGINNER)
                }
              >
                Start as a beginner
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForBeginners;
