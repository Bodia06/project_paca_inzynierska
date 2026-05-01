import * as yup from 'yup';
import CONSTANTS from '../constants';

const SCHEMAS = {
  //---USER VALIDATION---
  UserLoginSchema: yup.object({
    email: CONSTANTS.BASE_RULES.user_email,
    password: CONSTANTS.BASE_RULES.user_password,
  }),

  UserRegistrationSchema: yup.object({
    firstName: CONSTANTS.BASE_RULES.user_name.required(
      'First name is required'
    ),
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
      .oneOf(CONSTANTS.VALID_ROLES, 'Invalid role selected')
      .required('Role is required'),
    agreeOfTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the Terms & Conditions')
      .required('You must accept the Terms & Conditions'),
  }),

  UserUpdateSchema: yup.object({
    firstName: CONSTANTS.BASE_RULES.user_name.required(
      'First name is required'
    ),
    lastName: CONSTANTS.BASE_RULES.user_name.required('Last name is required'),
    email: CONSTANTS.BASE_RULES.user_email,
    displayName: CONSTANTS.BASE_RULES.user_displayName,
  }),

  //---INFO VALIDATION---
  InfoCreateSchema: yup.object({
    languageName: CONSTANTS.BASE_RULES.info_languageName,
    version: CONSTANTS.BASE_RULES.info_version,
    description: CONSTANTS.BASE_RULES.description,
  }),

  InfoUpdateSchema: yup.object({
    languageName: CONSTANTS.BASE_RULES.info_languageName,
    version: CONSTANTS.BASE_RULES.info_version,
    description: CONSTANTS.BASE_RULES.description,
  }),

  //---TASK VALIDATION---
  TaskCreateSchema: yup.object({
    modul: CONSTANTS.BASE_RULES.task_modul,
    title: CONSTANTS.BASE_RULES.task_title,
    description: CONSTANTS.BASE_RULES.description,
  }),
  TaskUpdateSchema: yup.object({
    modul: CONSTANTS.BASE_RULES.task_modul,
    title: CONSTANTS.BASE_RULES.task_title,
    description: CONSTANTS.BASE_RULES.description,
  }),

  //---SUBMISSION VALIDATION---
  SubmissionCreateSchema: yup.object({
    githubUrl: CONSTANTS.BASE_RULES.submission_githubUrl,
  }),
  SubmissionGradeSchema: yup.object({
    grade: CONSTANTS.BASE_RULES.submission_grade,
    feedback: CONSTANTS.BASE_RULES.description,
  }),

  //---PAYMENT VALIDATION---
  PayoutSchema: yup.object().shape({
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
  }),

  //---VACANCY VALIDATION
  VacancyCreateSchema: yup.object({
    title: CONSTANTS.BASE_RULES.vacancy_title,
    description: CONSTANTS.BASE_RULES.description,
    price: CONSTANTS.BASE_RULES.price,
  }),
  VacancyUpdateSchema: yup.object({
    title: CONSTANTS.BASE_RULES.vacancy_title,
    description: CONSTANTS.BASE_RULES.description,
    price: CONSTANTS.BASE_RULES.price.notRequired().nullable(),
  }),

  //---SOLUTION VALIDATION---
  SolutionCrateSchema: yup.object().shape({
    githubLink: CONSTANTS.BASE_RULES.submission_githubUrl,
  }),
  SolutionUpdateSchema: yup.object().shape({
    githubLink: CONSTANTS.BASE_RULES.submission_githubUrl,
  }),
};

export default SCHEMAS;
