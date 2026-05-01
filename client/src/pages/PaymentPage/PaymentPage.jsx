import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useLocation } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {
  topUpBalance,
  withdrawFunds,
  clearPayoutStatus,
} from '../../store/slices/payoutSlice';
import Input from '../../components/Helpers/Input/Input';
import SCHEMAS from '../../utils/validationSchems';
import styles from './PaymentPage.module.css';

export default function PaymentPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { isProcessing, error, statusMessage } = useSelector(
    (state) => state.payout
  );

  const [focus, setFocus] = useState('');
  const isWithdrawMode = location.pathname === '/cashout';

  useEffect(() => {
    return () => dispatch(clearPayoutStatus());
  }, [dispatch]);

  const initialValues = {
    amount: '',
    cardNumber: user?.cardNumber || '',
    expiry: '',
    cvc: '',
    name: user?.displayName?.toUpperCase() || '',
  };

  const handleSubmit = (values, { resetForm }) => {
    isWithdrawMode
      ? dispatch(withdrawFunds(values))
      : dispatch(topUpBalance(values));
    resetForm();
  };

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.mainLayout}>
        <article className={styles.heroSection}>
          <span className={styles.badge}>Secure Transaction</span>
          <h2 className={styles.title}>
            {isWithdrawMode ? 'Withdraw Your Funds' : 'Refill Internal Account'}
          </h2>
          <p className={styles.subtitle}>
            {isWithdrawMode
              ? 'Transfer money from your balance to your bank card safely.'
              : 'Add money to your account to start hiring or accessing premium features.'}
          </p>
        </article>
        <section className={styles.paymentContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={SCHEMAS.PayoutSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <section className={styles.glassCard}>
                <div className={styles.visualSide}>
                  <div className={styles.cardScaler}>
                    <div className={styles.cardWrapper}>
                      <Cards
                        number={values.cardNumber}
                        expiry={values.expiry}
                        cvc={values.cvc}
                        name={values.name}
                        focused={focus}
                      />
                    </div>
                  </div>
                  <div className={styles.balanceInfo}>
                    <label>Total Available</label>
                    <div className={styles.moneyValue}>
                      ${user?.balance || 0}
                    </div>
                  </div>
                </div>
                <Form className={styles.formSide}>
                  {(error || statusMessage) && (
                    <div
                      className={`${styles.statusAlert} ${error ? styles.error : styles.success}`}
                    >
                      {error || statusMessage}
                    </div>
                  )}
                  <div className={styles.formGrid}>
                    <div className={styles.fieldWrapper}>
                      <label className={styles.fieldLabel}>Amount (USD)</label>
                      <Input name="amount" type="number" placeholder="0.00" />
                    </div>
                    <div className={styles.fieldWrapper}>
                      <label className={styles.fieldLabel}>Card Number</label>
                      <Input
                        name="cardNumber"
                        placeholder="•••• •••• •••• ••••"
                        onFocus={(e) => setFocus(e.target.name)}
                      />
                    </div>
                    <div className={styles.fieldWrapper}>
                      <label className={styles.fieldLabel}>
                        Cardholder Name
                      </label>
                      <Input
                        name="name"
                        placeholder="FULL NAME"
                        onFocus={(e) => setFocus(e.target.name)}
                      />
                    </div>
                    <div className={styles.doubleRow}>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>Expiry Date</label>
                        <Input
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength="5"
                          onFocus={(e) => setFocus(e.target.name)}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <label className={styles.fieldLabel}>CVC</label>
                        <Input
                          name="cvc"
                          type="password"
                          placeholder="•••"
                          maxLength="4"
                          onFocus={(e) => setFocus(e.target.name)}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={
                      isWithdrawMode ? styles.btnWithdraw : styles.btnDeposit
                    }
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : isWithdrawMode
                        ? 'Withdraw'
                        : 'Deposit'}
                  </button>
                </Form>
              </section>
            )}
          </Formik>
        </section>
      </div>
    </section>
  );
}
