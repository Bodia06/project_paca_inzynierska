import { useField } from 'formik';
import styles from './Select.module.css';

const Select = ({ label, children, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        {...field}
        {...props}
        className={`${styles.selectField} ${
          meta.touched && meta.error ? styles.inputError : ''
        }`}
      >
        {children}
      </select>
      {meta.touched && meta.error && (
        <div className={styles.errorText}>{meta.error}</div>
      )}
    </div>
  );
};

export default Select;
