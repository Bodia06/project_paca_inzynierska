import {
  IoCloudUploadOutline,
  IoCodeWorking,
  IoBriefcaseOutline,
} from 'react-icons/io5';
import {
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCodeBracket,
  HiOutlinePaperAirplane,
  HiOutlineCheckBadge,
  HiOutlineBriefcase,
  HiOutlineCommandLine,
  HiOutlineBanknotes,
} from 'react-icons/hi2';
import * as yup from 'yup';
import { IdIcon, LangIcon, VersionIcon } from './components/Icons/Icons';

//---SERVER DATA---
const isProduction = import.meta.env.MODE === 'production';
const serverIP = isProduction ? 'your-production-domain.com' : 'localhost';
const serverPort = 5001;

const minioIP = isProduction ? 'your-production-domain.com' : 'localhost';
const minioPort = 9000; 
const bucketName = 'my-bucket';

//---REGEX DATA---
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

//---CONSTANTS---
export default {
  //---APP CONSTANTS---
  LOGO_SRC: '/staticImages/brand-logo.png',
  ACCESS_TOCKEN: 'accessToken',
  BASE_URL: `http://${serverIP}:${serverPort}/api/`,
  PUBLIC_URL_AVATAR: isProduction
    ? `https://${minioIP}/${bucketName}/avatars/`
    : `http://${minioIP}:${minioPort}/${bucketName}/avatars/`,

  INFO_IMAGE_PATH: isProduction
    ? `https://${minioIP}/${bucketName}/info/`
    : `http://${minioIP}:${minioPort}/${bucketName}/info/`,

  INTRODUCTION_HOME_IMAGE_PATH: '/staticImages/introduction-image.png',
  EMPLOYER_HOME_IMAGE_PATH: '/staticImages/employers.jpg',
  BEGINNER_HOME_IMAGE_PATH: '/staticImages/beginner.jpg',

  //---NAV CONSTANTS---
  NAV_LINKS: [
    { path: '/', label: 'Home' },
    { path: '/info', label: 'Updates' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/work', label: 'Work' },
  ],

  //---APP ROUTERS---
  APP_ROUTERS: {
    HOME: '/',
    INFO: '/info',
    INFO_DETAILS: '/info/:id',
    WORK: '/work',
    TASKS: '/tasks',
    VACANCY_DETAILS: '/vacancies/:vacancyId',

    LOGIN: '/login',
    REGISTRATION: '/registration',
    REGISTRATION_BEGINNER: '/registration?role=beginner',
    REGISTRATION_EMPLOYER: '/registration?role=employer',

    PROFILE: '/profile',
    SETTINGS: '/settings',

    PAYMENT: '/payment',
    CASHOUT: '/cashout',

    EMPLOYER_PANEL: '/employer-panel',
    MODERATION_PANEL: '/moderation-panel',
  },

  //---FOOTER CONSTANTS---
  SOCIAL_LINKS: {
    FACEBOOK: '#facebook',
    INSTAGRAM: '#instagram',
    TELEGRAM: '#telegram',
  },
  PLATFORM_LINKS: {
    COURSES: '#courses',
    BEGINNERS: '#beginners',
    WORK: '#work',
  },
  SUPPORT_LINKS: {
    FAQ: '#faq',
    CONTACT: '#contact',
    PRIVACY: '#privacy',
  },

  //---USER CONSTANTS---
  ANONYM_IMAGE_PATH: '/staticImages/anonym.png',
  MODERATOR_ROLE: 'moderator',
  EMPLOYER_ROLE: 'employer',
  BEGINNER_ROLE: 'beginner',

  //---INFO CONSTANTS---
  ANONYM_LANGUAGE_ICON_PATH: '/staticImages/default-language.png',

  //---PAGINATION DATA---
  INFO_LIMIT_PAGINATION: 4,
  TASKS_LIMIT_PAGINATION: 4,
  TASK_SUBMISSION_PAGINATION: 4,
  VACANCIES_LIMIT_PAGINATION: 4,

  //---FILTER DATA---
  FILTER_DATA: {
    vacancyFields: [
      {
        name: 'title',
        label: 'Job Title',
        placeholder: 'e.g. Developer',
        icon: LangIcon,
      },
      {
        name: 'status',
        label: 'Status',
        as: 'select',
        icon: VersionIcon,
        placeholder: 'All Statuses',
        options: [
          { label: 'Paid', value: 'paid' },
          { label: 'Completed', value: 'completed' },
        ],
      },
      {
        name: 'minPrice',
        label: 'Min Price (USD)',
        type: 'number',
        placeholder: 'e.g. 500',
        icon: IdIcon,
      },
    ],
    infoFields: [
      {
        name: 'id',
        label: 'Record ID',
        placeholder: 'e.g. 101',
        icon: IdIcon,
      },
      {
        name: 'languageName',
        label: 'Language',
        placeholder: 'e.g. JavaScript',
        icon: LangIcon,
      },
      {
        name: 'version',
        label: 'Version',
        placeholder: 'e.g. 1.2.4',
        icon: VersionIcon,
      },
    ],
    taskFields: [
      {
        name: 'modul',
        label: 'Module Name',
        placeholder: 'e.g. React Hooks',
        icon: LangIcon,
      },
      {
        name: 'title',
        label: 'Task Title',
        placeholder: 'Search by title...',
        icon: IdIcon,
      },
    ],
  },

  //---VALIDATION CONSTANTS---
  ...REGEX,
  VALID_ROLES: ['moderator', 'employer', 'beginner'],
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

  //---DATA INFORMATIONS CONSTANTS---
  FEATURES_DATA: [
    {
      id: 0,
      icon: IoCloudUploadOutline,
      title: 'Page Updates',
      description:
        'We will keep you updated on the development of programming languages...',
      link: '/info',
    },
    {
      id: 1,
      icon: IoCodeWorking,
      title: 'Page Tasks',
      description:
        'We will provide you with a variety of programming tasks to help you practice...',
      link: '/tasks',
    },
    {
      id: 2,
      icon: IoBriefcaseOutline,
      title: 'Page Work',
      description:
        'We will offer you the opportunity to work on real projects...',
      link: '/work',
    },
  ],
  INTRODUCTION_DATA: {
    INFO: {
      welcome: {
        title: 'Welcome to the Future of Programming Updates',
        tagline:
          'Your centralized gateway for real-time system updates and information management.',
        cta: 'Get Started',
      },
      cards: [
        {
          id: 'access',
          title: 'Instant Access',
          description:
            'Streamlined data retrieval with low-latency updates for all system users.',
          icon: HiOutlineBolt,
        },
        {
          id: 'security',
          title: 'Role-Based Security',
          description:
            'Granular permission layers ensuring data integrity and authorized moderation.',
          icon: HiOutlineShieldCheck,
        },
        {
          id: 'control',
          title: 'Master Control',
          description:
            'Powerful tools for moderators to curate, edit, and maintain the information flow.',
          icon: HiOutlineAdjustmentsHorizontal,
        },
      ],
    },
    TASK: {
      welcome: {
        title: 'Master Your Skills with Practical Tasks',
        tagline:
          'The bridge between theory and practice. Solve real-world challenges and get professional feedback.',
        cta: 'View All Tasks',
      },
      cards: [
        {
          id: 'execution',
          title: 'Practical Execution',
          description:
            'Detailed task modules designed to challenge your programming logic and architecture skills.',
          icon: HiOutlineCodeBracket,
        },
        {
          id: 'submission',
          title: 'Seamless Submission',
          description:
            'Submit your GitHub repository links directly to moderators with zero friction.',
          icon: HiOutlinePaperAirplane,
        },
        {
          id: 'grading',
          title: 'Expert Evaluation',
          description:
            'Receive objective grades (1-5) and detailed feedback to accelerate your learning curve.',
          icon: HiOutlineCheckBadge,
        },
      ],
    },
    WORK: {
      welcome: {
        title: 'Transform Your Career with Real Projects',
        tagline:
          'The ultimate marketplace for developers. Real tasks from real employers with guaranteed payouts and secure transactions.',
        cta: 'Browse Vacancies',
      },
      cards: [
        {
          id: 'hiring',
          title: 'Direct Hiring',
          description:
            'Employers post vacancies and fund the budget upfront, ensuring that every completed task is paid for.',
          icon: HiOutlineBriefcase,
        },
        {
          id: 'solution',
          title: 'Quality Solutions',
          description:
            'Beginners submit their work via GitHub. Employers review the code before accepting the final result.',
          icon: HiOutlineCommandLine,
        },
        {
          id: 'payout',
          title: 'Instant Payouts',
          description:
            'Once the solution is accepted, funds are automatically transferred from the vacancy fund to your balance.',
          icon: HiOutlineBanknotes,
        },
      ],
    },
  },
  LOCKED_CONTENT: {
    WORK_PAGE: {
      title: 'Work Page Locked',
      statusText: 'RESTRICTED',
      buttonText: 'Return to Tasks',
      description:
        'To unlock the Work Page and access exclusive job opportunities, you must first complete all practical tasks in the curriculum.',
      link: '/tasks',
    },
    TASKS_PAGE: {
      title: 'No Tasks Available',
      statusText: 'COMING SOON',
      buttonText: 'Check Updates',
      description:
        'Our managers are currently preparing the curriculum. Please wait until a moderator creates the first practical tasks for your track.',
      link: '/info',
    },
    INFO_PAGE: {
      title: 'Premium Info Locked',
      statusText: 'ACCESS RESTRICTED',
      buttonText: 'Start Learning',
      description:
        'Detailed documentation and advanced guides are available only for active students. Please complete your first practical task to unlock this section.',
      link: '/',
    },
  },
};
