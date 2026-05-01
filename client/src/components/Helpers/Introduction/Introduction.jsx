import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import CONSTANTS from '../../../constants';
import styles from './Introduction.module.css';

function Introduction() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const data = useMemo(() => {
    const introData = CONSTANTS.INTRODUCTION_DATA;

    if (pathname === '/info') return introData?.INFO;
    if (pathname === '/tasks') return introData?.TASK;
    if (pathname === '/work') return introData?.WORK;

    return introData?.INFO;
  }, [pathname]);

  if (!data) return null;

  const { welcome, cards } = data;

  return (
    <section className={styles.introContainer}>
      <div className={styles.blurCircle} />
      <div className={styles.heroSection}>
        <h2 className={styles.mainTitle}>{welcome.title}</h2>
        <p className={styles.tagline}>{welcome.tagline}</p>
        <button className={styles.ctaButton} onClick={() => navigate('/login')}>
          {welcome.cta}
          <span className={styles.arrow}>→</span>
        </button>
      </div>
      <div className={styles.cardsGrid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Icon className={styles.reactIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Introduction;
