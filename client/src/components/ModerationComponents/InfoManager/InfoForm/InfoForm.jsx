import { useState, useEffect, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createInfo,
  updateInfo,
  clearInfoError,
} from '../../../../store/slices/infoSlice';
import Input from '../../../Helpers/Input/Input';
import SCHEMAS from '../../../../utils/validationSchems';
import CONSTANTS from '../../../../constants';
import styles from './InfoForm.module.css';

const InfoForm = ({ editingInfo, onCancel }) => {
  const dispatch = useDispatch();
  const [filePreview, setFilePreview] = useState(null);
  const { isFetching, error } = useSelector((state) => state.info);

  useEffect(() => {
    dispatch(clearInfoError());
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [dispatch, filePreview]);

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.errors && Array.isArray(error.errors))
      return error.errors[0].message || 'Validation error';
    return 'Something went wrong';
  };

  const currentPreview = useMemo(() => {
    if (filePreview) return filePreview;
    if (editingInfo?.image && editingInfo.image !== 'default-language.png') {
      return `${CONSTANTS.INFO_IMAGE_PATH}${editingInfo.image}`;
    }
    return CONSTANTS.ANONYM_LANGUAGE_ICON_PATH;
  }, [filePreview, editingInfo]);

  const initialValues = {
    languageName: editingInfo?.languageName || '',
    description: editingInfo?.description || '',
    version: editingInfo?.version || '',
    image: null,
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('languageName', values.languageName);
    formData.append('description', values.description);
    formData.append('version', values.version);

    if (values.image) {
      formData.append('image', values.image);
    }

    const resultAction = editingInfo
      ? await dispatch(updateInfo({ id: editingInfo.id, data: formData }))
      : await dispatch(createInfo(formData));

    if (
      updateInfo.fulfilled.match(resultAction) ||
      createInfo.fulfilled.match(resultAction)
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
        aria-label="Close form"
      />
      <h3 className={styles.formTitle}>
        {editingInfo ? 'Edit Update' : 'New Update'}
      </h3>
      <Formik
        initialValues={initialValues}
        validationSchema={
          editingInfo ? SCHEMAS.InfoUpdateSchema : SCHEMAS.InfoCreateSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue }) => (
          <Form className={styles.formContainer}>
            {error && (
              <div className={styles.serverError}>
                <span>{renderError()}</span>
              </div>
            )}
            <div className={styles.row}>
              <Input name="languageName" placeholder="Language (e.g. Java)" />
              <Input name="version" placeholder="Version (e.g. 1.0.0)" />
            </div>
            <div className={styles.inputGroup}>
              <Input
                as="textarea"
                name="description"
                placeholder="What's new? You can use Markdown: [Link Text](https://link.com) and images: ![Alt text](https://image-url.com)"
                className={styles.textArea}
              />
            </div>
            <div className={styles.fileSection}>
              <label htmlFor="imageUpload" className={styles.fileLabel}>
                {filePreview ||
                (editingInfo?.image &&
                  editingInfo.image !== 'default-language.png')
                  ? 'Change Image'
                  : 'Upload Cover Image'}
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue('image', file);
                    if (filePreview) URL.revokeObjectURL(filePreview);
                    setFilePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <div className={styles.previewContainer}>
                <img
                  src={currentPreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              </div>
            </div>
            <div className={styles.buttonActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isFetching}
              >
                {isFetching
                  ? 'Processing...'
                  : editingInfo
                    ? 'Save Changes'
                    : 'Post Update'}
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
    </div>
  );
};

export default InfoForm;
