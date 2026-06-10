const yup = require('yup');
const CONSTANTS = require('../constants');

const UserLoginSchema = yup.object({
  email: CONSTANTS.BASE_RULES.user_email,
  password: CONSTANTS.BASE_RULES.user_password,
});

const UserRegistrationSchema = yup.object({
  firstName: CONSTANTS.BASE_RULES.user_name.required('First name is required'),
  lastName: CONSTANTS.BASE_RULES.user_name.required('Last name is required'),
  email: CONSTANTS.BASE_RULES.user_email,
  password: CONSTANTS.BASE_RULES.user_password,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  displayName: CONSTANTS.BASE_RULES.user_displayName,
  role: yup
    .string()
    .oneOf(CONSTANTS.USER_ROLES || [], 'Invalid role selected')
    .required('Role is required'),
  agreeOfTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms & Conditions')
    .required('You must accept the Terms & Conditions'),
});

const UserUpdateSchema = yup.object({
  firstName: CONSTANTS.BASE_RULES.user_name.required('First name is required'),
  lastName: CONSTANTS.BASE_RULES.user_name.required('Last name is required'),
  email: CONSTANTS.BASE_RULES.user_email,
  displayName: CONSTANTS.BASE_RULES.user_displayName,
});

const InfoCreateSchema = yup.object({
  languageName: CONSTANTS.BASE_RULES.info_languageName,
  version: CONSTANTS.BASE_RULES.info_version,
  description: CONSTANTS.BASE_RULES.description,
});

const InfoUpdateSchema = yup.object({
  languageName: CONSTANTS.BASE_RULES.info_languageName,
  version: CONSTANTS.BASE_RULES.info_version,
  description: CONSTANTS.BASE_RULES.description,
});

const TaskCreateSchema = yup.object({
  modul: CONSTANTS.BASE_RULES.task_modul,
  title: CONSTANTS.BASE_RULES.task_title,
  description: CONSTANTS.BASE_RULES.description,
});

const TaskUpdateSchema = yup.object({
  modul: CONSTANTS.BASE_RULES.task_modul,
  title: CONSTANTS.BASE_RULES.task_title,
  description: CONSTANTS.BASE_RULES.description,
});

const SubmissionCreateSchema = yup.object({
  githubUrl: CONSTANTS.BASE_RULES.submission_githubUrl,
});

const SubmissionGradeSchema = yup.object({
  grade: CONSTANTS.BASE_RULES.submission_grade,
  feedback: CONSTANTS.BASE_RULES.description,
});

const PayoutSchema = yup.object().shape({
  amount: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    )
    .positive('Amount must be positive')
    .min(1, 'Minimum amount is $1')
    .required('Required'),
  cardNumber: yup
    .string()
    .transform((value) => (value ? value.replace(/\s/g, '') : value))
    .length(16, 'Card number must be 16 digits')
    .matches(/^\d+$/, 'Only digits allowed')
    .required('Required'),
  name: yup
    .string()
    .trim()
    .min(2, 'Name too short')
    .matches(/^[A-Za-z\s]+$/, 'Only English letters and spaces are allowed')
    .required('Required'),
  expiry: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format')
    .required('Required'),
  cvc: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVC must be 3 or 4 digits')
    .required('Required'),
});

const VacancyCreateSchema = yup.object({
  title: CONSTANTS.BASE_RULES.vacancy_title,
  description: CONSTANTS.BASE_RULES.description,
  price: CONSTANTS.BASE_RULES.price,
});

const VacancyUpdateSchema = yup.object({
  title: CONSTANTS.BASE_RULES.vacancy_title,
  description: CONSTANTS.BASE_RULES.description,
  price: CONSTANTS.BASE_RULES.price,
});

const SolutionCreateSchema = yup.object().shape({
  githubLink: CONSTANTS.BASE_RULES.submission_githubUrl,
});

const SolutionUpdateSchema = yup.object().shape({
  githubLink: CONSTANTS.BASE_RULES.submission_githubUrl,
});

module.exports = {
  UserLoginSchema,
  UserRegistrationSchema,
  UserUpdateSchema,
  InfoCreateSchema,
  InfoUpdateSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
  SubmissionCreateSchema,
  SubmissionGradeSchema,
  PayoutSchema,
  VacancyCreateSchema,
  VacancyUpdateSchema,
  SolutionCreateSchema,
  SolutionUpdateSchema,
};