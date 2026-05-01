import React from 'react';
import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <section className={styles.container}>
      <div className={styles.morphContainer}>
        <div className={styles.spinner}></div>
      </div>
    </section>
  );
};

export default Spinner;
