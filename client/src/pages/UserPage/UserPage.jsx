import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import CONSTANTS from '../../constants';
import styles from './UserPage.module.css';

const getAvatarUrl = (avatar) => {
  if (!avatar || avatar === 'anon.png') return CONSTANTS.ANONYM_IMAGE_PATH;
  return `${CONSTANTS.PUBLIC_URL_AVATAR}${avatar}`;
};

function UserPage() {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const ratingClass = classNames(styles.userRatingValue, {
    [styles.userLowRating]: user.rating < 3,
    [styles.userMidRating]: user.rating >= 3 && user.rating < 4,
    [styles.userHighRating]: user.rating >= 4,
  });

  const ratingPercentage = (user.rating / 5) * 100;

  return (
    <section className={styles.userPage}>
      <div className={styles.userCard}>
        <article className={styles.userHeader}>
          <div className={styles.userCover} />
          <h2 className={styles.userHeaderTitle}>Account Management</h2>
          <div className={styles.userHeaderContent}>
            <div className={styles.userAvatarWrapper}>
              <img
                src={getAvatarUrl(user.avatar)}
                alt="User Image"
                className={styles.userAvatar}
              />
            </div>
            <div className={styles.userMainInfo}>
              <h2 className={styles.userName}>
                {user.firstName} {user.lastName}
              </h2>
              <p className={styles.userRole}>{user.role}</p>
            </div>
          </div>
        </article>
        <div className={styles.userGrid}>
          <section className={styles.userInfo}>
            <h3 className={styles.userSectionTitle}>General Information</h3>
            <div className={styles.userInfoList}>
              <div className={styles.userInfoRow}>
                <span className={styles.userInfoLabel}>Username</span>
                <p className={styles.userInfoValue}>@{user.displayName}</p>
              </div>
              <div className={styles.userInfoRow}>
                <span className={styles.userInfoLabel}>Email</span>
                <p className={styles.userInfoValue}>{user.email}</p>
              </div>
              <div className={styles.userInfoRow}>
                <span className={styles.userInfoLabel}>User ID</span>
                <p className={styles.userInfoValue}>
                  ID-{String(user.id).padStart(6, '0')}
                </p>
              </div>
            </div>
          </section>
          <aside className={styles.userSidebar}>
            {user.role === CONSTANTS.BEGINNER_ROLE && (
              <div className={styles.userWidget}>
                <span className={styles.userLabel}>Balance</span>
                <div className={styles.userBalance}>
                  <span className={styles.userCurrency}>$</span>{' '}
                  {user.balance.toLocaleString()}
                </div>
                <Link
                  to={CONSTANTS.APP_ROUTERS.CASHOUT}
                  className={styles.userPrimaryBtn}
                >
                  Cashout
                </Link>
              </div>
            )}
            {user.role === CONSTANTS.EMPLOYER_ROLE && (
              <div className={styles.userWidget}>
                <span className={styles.userLabel}>Balance</span>
                <div className={styles.userBalance}>
                  <span className={styles.userCurrency}>$</span>{' '}
                  {user.balance.toLocaleString()}
                </div>
                <Link
                  to={CONSTANTS.APP_ROUTERS.PAYMENT}
                  className={styles.userPrimaryBtn}
                >
                  Go to Payment
                </Link>
              </div>
            )}
            {user.role === CONSTANTS.MODERATOR_ROLE && (
              <div className={styles.userWidget}>
                <span className={styles.userLabel}>Tickets Resolved</span>
                <div className={styles.userStat}>
                  {user.moderationQueueCount || 0}{' '}
                  <span className={styles.userUnit}>items</span>
                </div>
                <Link
                  to={CONSTANTS.APP_ROUTERS.MODERATION_PANEL}
                  className={styles.userPrimaryBtn}
                >
                  Moderation Page
                </Link>
              </div>
            )}
            <aside className={styles.userWidget}>
              <span className={styles.userLabel}>Trust Score</span>
              <div className={ratingClass}>
                {user.rating}
                <span className={styles.userMaxRating}>/5</span>
              </div>
              <div className={styles.userBar}>
                <div
                  className={styles.userFill}
                  style={{ '--rating-width': `${ratingPercentage}%` }}
                />
              </div>
            </aside>
            <Link
              to={CONSTANTS.APP_ROUTERS.SETTINGS}
              className={styles.userSettings}
            >
              Account Settings
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default UserPage;
