import { FaFacebookF, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import CONSTANTS from '../../constants';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.brand}>
          <h2 className={styles.logoText}>Help To Start</h2>
          <p className={styles.brandDesc}>
            Learn programming from scratch with expert guidance and real-world
            projects.
          </p>
          <div className={styles.socialLinks}>
            <a
              href={CONSTANTS.SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noreferrer"
              className={styles.socialIcon}
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href={CONSTANTS.SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href={CONSTANTS.SOCIAL_LINKS.TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className={styles.socialIcon}
              aria-label="Telegram"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
        <article className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Platform</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href={CONSTANTS.PLATFORM_LINKS.COURSES}>Courses</a>
            </li>
            <li>
              <a href={CONSTANTS.PLATFORM_LINKS.BEGINNERS}>For Beginners</a>
            </li>
            <li>
              <a href={CONSTANTS.PLATFORM_LINKS.WORK}>Work Tab</a>
            </li>
          </ul>
        </article>
        <article className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Support</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href={CONSTANTS.SUPPORT_LINKS.FAQ}>FAQ</a>
            </li>
            <li>
              <a href={CONSTANTS.SUPPORT_LINKS.CONTACT}>Contact Us</a>
            </li>
            <li>
              <a href={CONSTANTS.SUPPORT_LINKS.PRIVACY}>Privacy Policy</a>
            </li>
          </ul>
        </article>
        <article className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Stay Updated</h4>
          <p className={styles.subscribeText}>
            Subscribe to get the latest news about new tasks.
          </p>
        </article>
      </div>
      <article className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <p>© {currentYear} Czestochowa University of Technology.</p>
          <p>Created by Bohdan Verbetskyi</p>
        </div>
      </article>
    </footer>
  );
}

export default Footer;
