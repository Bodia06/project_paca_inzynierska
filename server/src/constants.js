const path = require('path');
const yup = require('yup');

const REGEX = {
  ONLY_ENGLISH_CAPITALIZED: /^[A-Z][a-z]*$/,
  USER_DISPLAY_NAME: /^[A-Z][A-Za-z0-9\s]*$/,
  USER_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USER_EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  INFO_VERSION: /^\d+\.\d+\.\d+$/,
  SUBMISSION_GITHUB_URL: /^https:\/\/github\.com\//,
  TITLE: /^[A-Z][A-Za-z0-9\s]*$/,
};

module.exports = {
  ///APP CONSTANTS
  STATIC_PATH: path.join(process.cwd(), 'public'),
  ///USER CONSTANTS
  USER_ROLES: ['moderator', 'employer', 'beginner'],
  MODERATOR_ROLE: 'moderator',
  EMPLOYER_ROLE: 'employer',
  BEGINNER_ROLE: 'beginner',
  ///AUTH CONSTANTS
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_key_123456789_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ///BCRYPT CONSTANTS
  SALT_ROUNDS: 10,
  ///VACANCY CONSTANTS
  VACANCY_STATUS: ['paid', 'completed'],
  ///SOLUTION CONSTANTS
  SOLUTION_STATUS: ['pending', 'accepted', 'rejected'],
  ///VALIDATION CONSTANTS
  ...REGEX,
  BASE_RULES: {
    user_email: yup
      .string()
      .trim()
      .lowercase()
      .matches(REGEX.USER_EMAIL, 'Invalid email format (e.g. name@domain.com)')
      .max(255, 'Email is too long')
      .required('Email is required'),
    user_password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .matches(
        REGEX.USER_PASSWORD,
        'Password must contain uppercase, lowercase, number and special character (@$!%*?&)'
      )
      .required('Password is required'),
    user_name: yup
      .string()
      .trim()
      .matches(
        REGEX.ONLY_ENGLISH_CAPITALIZED,
        `Name must start with an uppercase English letter`
      )
      .min(2, `Name too short`)
      .max(50, `Name too long`),
    user_displayName: yup
      .string()
      .trim()
      .matches(
        REGEX.USER_DISPLAY_NAME,
        'Display name must start with an uppercase English letter'
      )
      .min(3, 'Display name too short')
      .max(30, 'Display name too long')
      .required('Display name is required'),

    info_languageName: yup
      .string()
      .trim()
      .matches(
        REGEX.TITLE,
        'Language name must start with an uppercase English letter'
      )
      .required('Language name is required'),
    info_version: yup
      .string()
      .trim()
      .matches(REGEX.INFO_VERSION, 'Use x.x.x format')
      .required('Language version is required'),

    task_modul: yup
      .string()
      .trim()
      .min(2, 'Module name too short')
      .max(100, 'Module name too long')
      .matches(REGEX.TITLE, 'Modul must start with an uppercase letter')
      .required('Module is required'),
    task_title: yup
      .string()
      .trim()
      .min(5, 'Title too short')
      .max(255, 'Title too long')
      .matches(REGEX.TITLE, 'Title must start with an uppercase letter')
      .required('Title is required'),
    submission_githubUrl: yup
      .string()
      .trim()
      .url('Must be a valid URL')
      .matches(REGEX.SUBMISSION_GITHUB_URL, 'Only GitHub links are allowed')
      .required('GitHub URL is required'),

    submission_grade: yup
      .number()
      .typeError('Grade must be a number')
      .min(0, 'Grade cannot be less than 0')
      .max(5, 'Grade cannot be more than 5')
      .integer('Grade must be a whole number')
      .required('Grade is required'),

    description: yup
      .string()
      .trim()
      .min(20, 'Too short')
      .matches(/^[A-Z]/, 'Must start with an uppercase letter')
      .required('Version description is required'),

    vacancy_title: yup
      .string()
      .trim()
      .min(5, 'Title too short')
      .max(255, 'Title too long')
      .matches(REGEX.TITLE, 'Title must start with an uppercase letter')
      .required('Title is required'),
    price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      )
      .typeError('Price must be a number')
      .positive('Price must be greater than zero')
      .test(
        'is-decimal',
        'Price cannot have more than 2 decimal places',
        (val) => {
          if (val === undefined || val === null) return true;
          return /^\d+(\.\d{1,2})?$/.test(val.toString());
        }
      )
      .required('Price is required'),
  },
};