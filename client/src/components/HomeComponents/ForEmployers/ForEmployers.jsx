import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from './ForEmployers.module.css';

function ForEmployers({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <section className={styles.forEmployersSection}>
      <div className={styles.forEmployersContainer}>
        <div className={styles.forEmployersInfo}>
          <span className={styles.subTitle}>HIRE TALENT</span>
          <h2 className={styles.title}>For Employers</h2>
          <p className={styles.text}>
            If you are an employer, you can post your projects in the
            <strong> “Work” tab</strong> and find the right specialists for your
            tasks.
          </p>
          <div className={styles.highlightBox}>
            <p>
              Check the portfolio of our top graduates and invite them to work
              on your projects directly.
            </p>
          </div>
          <div className={styles.btnWrapper}>
            {isLoggedIn ? (
              <div className={styles.welcomeEmployerBadge}>
                Ready to find your next pro?
              </div>
            ) : (
              <button
                className={styles.employerBtn}
                onClick={() =>
                  navigate(CONSTANTS.APP_ROUTERS.REGISTRATION_EMPLOYER)
                }
              >
                Start as an employer
              </button>
            )}
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img
            src={CONSTANTS.EMPLOYER_HOME_IMAGE_PATH}
            alt="Employer Image"
            className={styles.employerImg}
          />
        </div>
      </div>
    </section>
  );
}

export default ForEmployers;
