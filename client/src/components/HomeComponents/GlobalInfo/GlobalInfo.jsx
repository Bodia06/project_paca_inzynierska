import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from './GlobalInfo.module.css';

function GlobalInfo({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <section className={styles.introductionContainer}>
      <div className={styles.bgGlow}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.contentSide}>
          <div className={styles.statusBadge}>
            <span className={styles.dot}></span>
            Join HelpToStart Community
          </div>
          <h2 className={styles.mainTitle}>
            Congratulations! <br />
            <span className={styles.gradientText}>Your IT career</span> <br />
            is starting here!
          </h2>
          <p className={styles.description}>
            HelpToStart is a space where complex technologies become
            understandable. We build the bridge between your first line of code
            and your first job.
          </p>
          <div className={styles.actionArea}>
            {isLoggedIn ? (
              <div className={styles.welcomeBadge}>Welcome back!</div>
            ) : (
              <button
                className={styles.mainBtn}
                onClick={() => navigate(CONSTANTS.APP_ROUTERS.LOGIN)}
              >
                Get Started
              </button>
            )}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <strong>40+</strong>
                <span>Courses</span>
              </div>
              <div className={styles.statLine}></div>
              <div className={styles.statItem}>
                <strong>12</strong>
                <span>Projects</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.visualSide}>
          <div className={styles.imageCard}>
            <img
              src={CONSTANTS.INTRODUCTION_HOME_IMAGE_PATH}
              alt="IT Career Start Image"
              className={styles.heroImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobalInfo;
