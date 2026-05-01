import { useSelector } from 'react-redux';
import Features from '../../components/HomeComponents/Features/Features';
import ForBeginners from '../../components/HomeComponents/ForBeginners/ForBeginners';
import ForEmployers from '../../components/HomeComponents/ForEmployers/ForEmployers';
import GlobalInfo from '../../components/HomeComponents/GlobalInfo/GlobalInfo';
import styles from './HomePage.module.css';

function HomePage() {
  const { user } = useSelector((state) => state.user);

  const isLoggedIn = !!user;

  return (
    <section className={styles.homePageContainer}>
      <section className={styles.heroSection}>
        <GlobalInfo isLoggedIn={isLoggedIn} />
      </section>
      <section className={styles.audienceSection}>
        <div className={styles.sectionTitle}>
          <span>Who is it for?</span>
          <h2>Choose your path with HelpToStart</h2>
        </div>
        <ForBeginners isLoggedIn={isLoggedIn} />
        <div className={styles.divider} />
        <ForEmployers isLoggedIn={isLoggedIn} />
      </section>
      <section className={styles.featuresSection}>
        <Features />
      </section>
    </section>
  );
}

export default HomePage;
