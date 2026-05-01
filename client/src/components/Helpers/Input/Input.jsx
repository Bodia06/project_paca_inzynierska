import { useField } from 'formik';
import styles from './Input.module.css';

const Input = ({ as, ...props }) => {
  const [field, meta] = useField(props);

  const Component = as || 'input';

  return (
    <div className={styles.inputGroup}>
      <Component
        {...field}
        {...props}
        className={`${styles.inputField} ${
          meta.touched && meta.error ? styles.inputError : ''
        } ${props.className || ''}`}
      />
      {meta.touched && meta.error && (
        <div className={styles.errorText}>{meta.error}</div>
      )}
    </div>
  );
};

export default Input;
