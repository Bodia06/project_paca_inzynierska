import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import CONSTANTS from '../../../constants';
import styles from './UserMenu.module.css';

function UserMenu({ logout, isVisible, closeMenu }) {
  const { user } = useSelector((state) => state.user);

  const menuClasses = classNames(styles.userMenuDropdown, {
    [styles.active]: isVisible,
  });

  return (
    <section className={menuClasses}>
      <ul>
        <Link to={CONSTANTS.APP_ROUTERS.PROFILE} onClick={closeMenu}>
          <li>Profile</li>
        </Link>
        {user.role === CONSTANTS.MODERATOR_ROLE && (
          <Link to={CONSTANTS.APP_ROUTERS.MODERATION_PANEL} onClick={closeMenu}>
            <li>Moderation Panel</li>
          </Link>
        )}
        {user.role === CONSTANTS.EMPLOYER_ROLE && (
          <Link to={CONSTANTS.APP_ROUTERS.EMPLOYER_PANEL} onClick={closeMenu}>
            <li>Employer Panel</li>
          </Link>
        )}
        <Link to={CONSTANTS.APP_ROUTERS.SETTINGS} onClick={closeMenu}>
          <li>Settings</li>
        </Link>
        <li
          onClick={() => {
            logout();
            closeMenu();
          }}
          className={styles.logoutBtn}
        >
          Sign Out
        </li>
      </ul>
    </section>
  );
}

export default UserMenu;
