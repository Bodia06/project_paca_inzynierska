import FeaturesItem from '../FeaturesItem/FeaturesItem';
import CONSTANTS from '../../../constants';
import styles from './Features.module.css';

function Features() {
  return (
    <section className={styles.featuresContainer}>
      <h2>Why Choose Our Platform?</h2>
      <ul className={styles.featuresWrapper}>
        {CONSTANTS.FEATURES_DATA.map((item) => (
          <FeaturesItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default Features;
