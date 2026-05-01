import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import UserMenu from '../UserComponents/UserMenu/UserMenu';
import CONSTANTS from '../../constants';
import styles from './Navigation.module.css';

const Navigation = ({ isOpen, isFetching, user, handleLogout, closeMenu }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeAllMenus = useCallback(() => {
    setIsUserMenuOpen(false);
    closeMenu?.();
  }, [closeMenu]);

  const handleRedirect = useCallback(
    (path) => {
      closeAllMenus();
      navigate(path);
    },
    [navigate, closeAllMenus]
  );

  const onLogoutClick = useCallback(() => {
    handleLogout();
    closeAllMenus();
    navigate('/', { replace: true });
  }, [handleLogout, closeAllMenus, navigate]);

  const toggleUserMenu = (state) => {
    if (window.innerWidth > 992) {
      setIsUserMenuOpen(state);
    }
  };

  const avatarUrl = useMemo(() => {
    if (!user?.avatar || user.avatar === 'anon.png') {
      return CONSTANTS.ANONYM_IMAGE_PATH;
    }
    return `${CONSTANTS.PUBLIC_URL_AVATAR}${user.avatar}`;
  }, [user?.avatar]);

  const navClasses = classNames(styles.nav, {
    [styles.navActive]: isOpen,
  });

  const profileBtnClasses = classNames(styles.profileBtn, {
    [styles.profileBtnActive]: isUserMenuOpen,
  });

  const caretClasses = classNames(styles.caret, {
    [styles.caretRotate]: isUserMenuOpen,
  });

  return (
    <nav className={navClasses}>
      {CONSTANTS.NAV_LINKS.map(({ path, label }) => (
        <Link key={path} to={path} onClick={closeAllMenus}>
          {label}
        </Link>
      ))}
      <section className={styles.headerBtn}>
        {isFetching ? (
          <div className={styles.skeletonLoader} />
        ) : user ? (
          <section
            className={styles.userMenuWrapper}
            onMouseEnter={() => toggleUserMenu(true)}
            onMouseLeave={() => toggleUserMenu(false)}
          >
            <button
              aria-expanded={isUserMenuOpen}
              className={profileBtnClasses}
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              <div className={styles.avatarPlaceholder}>
                <img
                  src={avatarUrl}
                  alt={user.displayName || 'User' + 'Image'}
                  className={styles.userAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = CONSTANTS.ANONYM_IMAGE_PATH;
                  }}
                />
              </div>
              <span className={styles.userName}>{user.displayName}</span>
              <svg
                className={caretClasses}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <UserMenu
              logout={onLogoutClick}
              isVisible={isUserMenuOpen}
              closeMenu={closeAllMenus}
            />
          </section>
        ) : (
          <section className={styles.authButtons}>
            <button
              className={styles.signIn}
              onClick={() => handleRedirect(CONSTANTS.APP_ROUTERS.LOGIN)}
            >
              Sign in
            </button>
            <button
              className={styles.signUp}
              onClick={() => handleRedirect(CONSTANTS.APP_ROUTERS.REGISTRATION)}
            >
              Sign up
            </button>
          </section>
        )}
      </section>
    </nav>
  );
};

export default Navigation;
