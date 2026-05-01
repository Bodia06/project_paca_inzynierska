import { HiOutlineArrowRight } from 'react-icons/hi2';
import styles from './FeaturesItem.module.css';

function FeaturesItem({ item }) {
  const Icon = item.icon;

  return (
    <li className={styles.featuresItem}>
      <div className={styles.featuresItemContent}>
        <div className={styles.iconContainer}>
          {Icon && <Icon className={styles.featureIcon} />}
        </div>
        <div className={styles.featuresItemInfo}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
        <div className={styles.featuresItemLink}>
          <a href={item.link} className={styles.actionButton}>
            Learn More
            <HiOutlineArrowRight className={styles.arrow} />
          </a>
        </div>
      </div>
    </li>
  );
}

export default FeaturesItem;
