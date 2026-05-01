import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CalendarDays,
  UserCircle,
  Hash,
  Info,
  Briefcase,
  DollarSign,
  Code,
} from 'lucide-react';
import {
  fetchVacancyById,
  clearVacancyError,
} from '../../store/slices/vacancySlice';
import {
  clearSolutionStatus,
  createSolution,
  updateSolution,
  setInitialSolution,
} from '../../store/slices/solutionSlice';
import SolutionDisplay from '../../components/WorkComponents/SolutionDisplay/SolutionDisplay';
import SolutionForm from '../../components/WorkComponents/SolutionForm/SolutionForm';
import Spinner from '../../components/Helpers/Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './VacancyDetailsPage.module.css';

export default function VacancyDetailsPage() {
  const { vacancyId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { items: vacancies, isFetching: isVacanciesFetching } = useSelector(
    (state) => state.vacancies
  );
  const { user } = useSelector((state) => state.user);
  const {
    isFetching: isSending,
    error: solutionError,
    successMessage,
    itemsByVacancy,
  } = useSelector((state) => state.solutions);

  const vacancy = vacancies.find(
    (item) => String(item.id) === String(vacancyId)
  );
  const existingSolution = itemsByVacancy[vacancyId];

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const response = await dispatch(fetchVacancyById(vacancyId)).unwrap();
        const mySolution = response.data?.solutions?.[0];
        if (mySolution) dispatch(setInitialSolution(mySolution));
        setTimeout(() => setIsLoaded(true), 100);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();

    return () => {
      dispatch(clearVacancyError());
      dispatch(clearSolutionStatus());
    };
  }, [dispatch, vacancyId]);

  if (isVacanciesFetching && !vacancy) {
    return (
      <div className={styles.loadingWrapper}>
        <Spinner />
      </div>
    );
  }

  if (!vacancy) return null;

  const formattedDate = new Date(vacancy.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.bgGlow} />
      <div className={styles.mainLayout}>
        <section className={styles.visualSide}>
          <div
            className={`${styles.visualContent} ${isLoaded ? styles.reveal : ''}`}
          >
            <div className={styles.statusFrame}>
              <div className={styles.iconCircle}>
                <Briefcase size={80} />
              </div>
            </div>
            <div className={styles.heroInfo}>
              <div className={`${styles.statusTag} ${styles[vacancy.status]}`}>
                <Briefcase size={14} />
                <span>Status: {vacancy.status}</span>
              </div>
              <h3 className={styles.mainTitle}>{vacancy.title}</h3>
            </div>
          </div>
        </section>
        <section className={styles.contentSide}>
          <div
            className={`${styles.detailsContainer} ${isLoaded ? styles.revealUp : ''}`}
          >
            <article className={styles.headerGroup}>
              <h2 className={styles.titleLarge}>Job Specification</h2>
              <p className={styles.subtitleLarge}>
                Detailed requirements and financial overview for this position.
              </p>
            </article>
            <section className={styles.specsGrid}>
              <div className={styles.card}>
                <Hash className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Reference ID</label>
                  <p>#{vacancy.id}</p>
                </div>
              </div>
              <div className={styles.card}>
                <DollarSign className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Budget</label>
                  <p>{vacancy.price} USD</p>
                </div>
              </div>
              <div className={styles.card}>
                <UserCircle className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Employer</label>
                  <p>USR_{vacancy.employerId}</p>
                </div>
              </div>
              <div className={styles.card}>
                <CalendarDays className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Posted Date</label>
                  <p>{formattedDate}</p>
                </div>
              </div>
            </section>
            <div className={styles.descSection}>
              <div className={styles.descTitle}>
                <Info size={22} />
                <h3>Description</h3>
              </div>
              <div className={styles.descBox}>
                <p>{vacancy.description}</p>
              </div>
            </div>
            {user?.role === CONSTANTS.BEGINNER_ROLE &&
              (vacancy.status === 'paid' || vacancy.status === 'open') && (
                <section className={styles.actionSection}>
                  <div className={styles.descTitle}>
                    <Code size={22} />
                    <h3>Work Submission</h3>
                  </div>
                  <div className={styles.formContainer}>
                    {existingSolution && !isEditing ? (
                      <SolutionDisplay
                        solution={existingSolution}
                        successMessage={successMessage}
                        onEdit={() => {
                          dispatch(clearSolutionStatus());
                          setIsEditing(true);
                        }}
                      />
                    ) : (
                      <SolutionForm
                        initialLink={existingSolution?.githubLink}
                        isSending={isSending}
                        error={solutionError}
                        onSubmit={async (values) => {
                          const action = existingSolution
                            ? updateSolution
                            : createSolution;
                          const payload = existingSolution
                            ? {
                                solutionId: existingSolution.id,
                                githubLink: values.githubLink,
                              }
                            : {
                                vacancyId: vacancy.id,
                                githubLink: values.githubLink,
                              };

                          await dispatch(action(payload)).unwrap();
                          setIsEditing(false);
                        }}
                        onCancel={isEditing ? () => setIsEditing(false) : null}
                      />
                    )}
                  </div>
                </section>
              )}
          </div>
        </section>
      </div>
    </section>
  );
}
