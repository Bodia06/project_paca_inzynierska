import LoginForm from '../../components/AuthComponents/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    <section className={styles.loginPage}>
      <div className={styles.loginFormContainer}>
        <LoginForm />
      </div>
    </section>
  );
}

export default LoginPage;
