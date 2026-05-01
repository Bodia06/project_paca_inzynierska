import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../../store/slices/userSlice';
import Navigation from '../Navigation/Navigation';
import CONSTANTS from '../../constants';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isFetching } = useSelector((state) => state.user);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const burgerClasses = classNames(styles.burger, {
    [styles.burgerActive]: isMenuOpen,
  });

  return (
    <header className={styles.mainNav}>
      <div
        className={styles.logo}
        onClick={() => {
          navigate('/');
          closeMenu();
        }}
      >
        <img
          src={CONSTANTS.LOGO_SRC}
          alt="HelpToStart Logo"
          className={styles.logoImg}
        />
        <span className={styles.logoText}>HelpToStart</span>
      </div>
      <div className={burgerClasses} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Navigation
        isOpen={isMenuOpen}
        isFetching={isFetching}
        user={user}
        handleLogout={handleLogout}
        closeMenu={closeMenu}
      />
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </header>
  );
}

export default Header;
