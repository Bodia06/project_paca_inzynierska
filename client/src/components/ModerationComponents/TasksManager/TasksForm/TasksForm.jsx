import { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTask,
  updateTask,
  clearTaskError,
} from '../../../../store/slices/taskSlice';
import Input from '../../../Helpers/Input/Input';
import SCHEMAS from '../../../../utils/validationSchems';
import styles from './TasksForm.module.css';

const normalizeModuleString = (modulName) => {
  if (!modulName || typeof modulName !== 'string') return modulName;

  const technologies = modulName.split(',');

  const cleanedTechnologies = technologies
    .map((tech) => {
      const cleanTech = tech.trim().replace(/\s+/g, ' ');
      if (!cleanTech) return null;
      return cleanTech
        .split(' ')
        .map((word) => {
          if (/^[+\-.#]+$/.test(word)) return word;

          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    })
    .filter(Boolean);

  const uniqueTechnologies = [...new Set(cleanedTechnologies)];

  uniqueTechnologies.sort((a, b) => a.localeCompare(b));

  return uniqueTechnologies.join(', ');
};

const TasksForm = ({ editingTask, onCancel }) => {
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(clearTaskError());
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
    modul: editingTask?.modul || '',
    title: editingTask?.title || '',
    description: editingTask?.description || '',
  };

  const handleSubmit = async (values) => {
    const normalizedValues = {
      ...values,
      modul: normalizeModuleString(values.modul),
    };

    const resultAction = editingTask
      ? await dispatch(
          updateTask({ taskId: editingTask.id, data: normalizedValues })
        )
      : await dispatch(createTask(normalizedValues));

    if (
      updateTask.fulfilled.match(resultAction) ||
      createTask.fulfilled.match(resultAction)
    ) {
      onCancel();
    }
  };

  return (
    <div className={styles.formWrapper}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onCancel}
        aria-label="Close"
      />
      <h3 className={styles.formTitle}>
        {editingTask ? 'Edit Task' : 'New Task'}
      </h3>
      <Formik
        initialValues={initialValues}
        validationSchema={
          editingTask ? SCHEMAS.TaskUpdateSchema : SCHEMAS.TaskCreateSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        <Form className={styles.formContainer}>
          {error && (
            <div className={styles.serverError}>
              <span>{renderError()}</span>
            </div>
          )}
          <div className={styles.row}>
            <Input name="modul" placeholder="Module (e.g. React, Java)" />
            <Input name="title" placeholder="Task Title" />
          </div>
          <div className={styles.inputGroup}>
            <Input
              as="textarea"
              name="description"
              placeholder="Detailed task description and requirements..."
              className={styles.textArea}
            />
          </div>
          <div className={styles.buttonActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isFetching}
            >
              {isFetching
                ? 'Processing...'
                : editingTask
                  ? 'Save Changes'
                  : 'Create Task'}
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
      </Formik>
    </div>
  );
};

export default TasksForm;
