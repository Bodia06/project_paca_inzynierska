import RegistrationForm from '../../components/AuthComponents/RegistrationForm/RegistrationForm';
import styles from './RegistartionPage.module.css';

function RegistrationPage() {
  return (
    <section className={styles.registrationPage}>
      <div className={styles.registrationFormContainer}>
        <RegistrationForm />
      </div>
    </section>
  );
}

export default RegistrationPage;
