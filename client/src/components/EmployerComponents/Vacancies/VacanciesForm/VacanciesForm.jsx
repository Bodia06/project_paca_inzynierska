import { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createVacancy,
  updateVacancy,
  clearVacancyError,
} from '../../../../store/slices/vacancySlice';
import Input from '../../../Helpers/Input/Input';
import SCHEMAS from '../../../../utils/validationSchems';
import styles from './VacanciesForm.module.css';

const VacanciesForm = ({ editingVacancy, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.vacancies);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearVacancyError());
    return () => {
      dispatch(clearVacancyError());
    };
  }, [dispatch]);

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.errors && Array.isArray(error.errors))
      return error.errors[0].message || 'Validation error';
    return 'Something went wrong';
  };

  const initialValues = {
    title: editingVacancy?.title || '',
    description: editingVacancy?.description || '',
    price: editingVacancy?.price || '',
  };

  const handleSubmit = async (values) => {
    const resultAction = editingVacancy
      ? await dispatch(
          updateVacancy({ vacancyId: editingVacancy.id, data: values })
        )
      : await dispatch(createVacancy(values));

    if (
      updateVacancy.fulfilled.match(resultAction) ||
      createVacancy.fulfilled.match(resultAction)
    ) {
      if (onSuccess) onSuccess();
      else onCancel();
    }
  };

  return (
    <section className={styles.formWrapper}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onCancel}
        aria-label="Close form"
      />
      <h3 className={styles.formTitle}>
        {editingVacancy ? 'Edit Vacancy' : 'New Vacancy'}
      </h3>

      <Formik
        initialValues={initialValues}
        validationSchema={
          editingVacancy
            ? SCHEMAS.VacancyUpdateSchema
            : SCHEMAS.VacancyCreateSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form className={styles.formContainer}>
            {error && (
              <div className={styles.serverError}>
                <span>{renderError()}</span>
              </div>
            )}
            <div className={styles.row}>
              <Input
                name="title"
                placeholder="Job Title (e.g. Frontend Developer)"
              />
              <Input name="price" type="number" placeholder="Budget (USD)" />
            </div>
            <div className={styles.inputGroup}>
              <Input
                as="textarea"
                name="description"
                placeholder="Describe requirements and tasks..."
                className={styles.textArea}
              />
            </div>
            <div className={styles.balancePreview}>
              <p>
                Current Balance: <strong>${user?.balance}</strong>
              </p>
            </div>
            <div className={styles.buttonActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isFetching || isSubmitting}
              >
                {isFetching
                  ? 'Processing...'
                  : editingVacancy
                    ? 'Save Changes'
                    : 'Post & Pay'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default VacanciesForm;
