import { Formik, Form } from 'formik';
import Input from '../../Helpers/Input/Input';
import styles from './BaseFilter.module.css';

const BaseFilter = ({
  title,
  subtitle,
  fields,
  initialValues,
  onFilterApply,
}) => {
  const getInitialValues = () => {
    const values = {};
    fields.forEach((field) => {
      values[field.name] = initialValues?.[field.name] || '';
    });
    return values;
  };

  const handleReset = (resetForm) => {
    const emptyValues = {};
    fields.forEach((field) => {
      emptyValues[field.name] = undefined;
    });
    resetForm();
    onFilterApply(emptyValues);
  };

  return (
    <aside className={styles.filterSidebar}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
        onSubmit={(values) => {
          const cleanFilters = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [
              k,
              v?.toString().trim() || undefined,
            ])
          );
          onFilterApply(cleanFilters);
        }}
      >
        {({ resetForm }) => (
          <Form className={styles.form}>
            <div className={styles.inputStack}>
              {fields.map((field) => {
                const IconComponent = field.icon;

                return (
                  <div className={styles.field} key={field.name}>
                    <label>
                      <span className={styles.iconWrapper}>
                        {IconComponent && <IconComponent />}
                      </span>
                      {field.label}
                    </label>

                    {field.as === 'select' ? (
                      <Input
                        name={field.name}
                        as="select"
                        placeholder={field.placeholder}
                      >
                        <option value="">
                          {field.placeholder || 'Select option'}
                        </option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Input>
                    ) : (
                      <Input
                        name={field.name}
                        as="input"
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.searchBtn}>
                Apply Filters
              </button>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => handleReset(resetForm)}
              >
                Clear All
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </aside>
  );
};

export default BaseFilter;
