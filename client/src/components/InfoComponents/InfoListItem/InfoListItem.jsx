import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from './InfoListItem.module.css';

function InfoListItem({ info }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const isDefaultIcon = useMemo(() => {
    return !info.image || info.image === 'default-language.png';
  }, [info.image]);

  const imageSrc = useMemo(() => {
    if (isDefaultIcon) {
      return CONSTANTS.ANONYM_LANGUAGE_ICON_PATH;
    }
    return `${CONSTANTS.INFO_IMAGE_PATH}${info.image}`;
  }, [info.image, isDefaultIcon]);

  return (
    <li className={styles.infoListContainer}>
      <Link to={`/info/${info.id}`} className={styles.infoCardLink}>
        <article className={styles.infoCard}>
          <div className={styles.infoImageWrapper}>
            {!isLoaded && <div className={styles.skeleton}></div>}
            <img
              src={imageSrc}
              alt={info.languageName}
              className={`
                ${styles.cardImage} 
                ${isLoaded ? styles.imageVisible : styles.imageHidden}
                ${isDefaultIcon ? styles.isDefault : styles.isCustom}
              `}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CONSTANTS.ANONYM_LANGUAGE_ICON_PATH;
              }}
            />
          </div>
          <div className={styles.infoCardContent}>
            <span className={styles.infoCardLanguage}>{info.languageName}</span>
            <h3 className={styles.infoCardTitle}>{info.languageName} Update</h3>
            <p className={styles.infoCardVersion}>v{info.version}</p>
          </div>
        </article>
      </Link>
    </li>
  );
}

export default InfoListItem;
