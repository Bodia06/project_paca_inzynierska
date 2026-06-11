import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CalendarDays, UserCircle, Hash, Info, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CONSTANTS from '../../constants';
import styles from './InfoDetailsPage.module.css';

function InfoDetailsPage() {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  const info = useSelector((state) =>
    state.info.info.find((item) => item.id === parseInt(id))
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!info) {
    return (
      <section className={styles.pageWrapper}>
        <div className={styles.loadingState}>Loading parameters...</div>
      </section>
    );
  }

  const formattedDate = new Date(info.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.bgGlow} />
      <div className={styles.mainLayout}>
        <section className={styles.visualSide}>
          <div
            className={`${styles.visualContent} ${isLoaded ? styles.reveal : ''}`}
          >
            <div className={styles.imageFrame}>
              <img
                src={`${CONSTANTS.INFO_IMAGE_PATH}${info.image}`}
                alt={info.languageName}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  e.target.src = CONSTANTS.ANONYM_LANGUAGE_ICON_PATH;
                }}
              />
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.versionTag}>
                <Activity size={14} />
                <span>Version {info.version}</span>
              </div>
              <h3 className={styles.mainTitle}>{info.languageName}</h3>
            </div>
          </div>
        </section>
        <section className={styles.contentSide}>
          <div
            className={`${styles.detailsContainer} ${isLoaded ? styles.revealUp : ''}`}
          >
            <div className={styles.headerGroup}>
              <h2 className={styles.titleLarge}>Technical Overview</h2>
              <p className={styles.subtitleLarge}>
                Full system specification and internal object documentation.
              </p>
            </div>
            <div className={styles.specsGrid}>
              <div className={styles.card}>
                <Hash className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Build ID</label>
                  <p>#{info.id}</p>
                </div>
              </div>
              <div className={styles.card}>
                <UserCircle className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Author</label>
                  <p>USR_{info.userId}</p>
                </div>
              </div>
              <div className={styles.card}>
                <CalendarDays className={styles.icon} size={24} />
                <div className={styles.cardContent}>
                  <label>Release</label>
                  <p>{formattedDate}</p>
                </div>
              </div>
            </div>
            <div className={styles.descSection}>
              <div className={styles.descTitle}>
                <Info size={22} />
                <h3>System Description</h3>
              </div>
              <div className={styles.descBox}>
                {info.description ? (
                  <ReactMarkdown
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.renderedLink}
                        />
                      ),
                      img: ({ ...props }) => (
                        <img
                          {...props}
                          className={styles.renderedInnerImage}
                          alt={props.alt || 'System documentation asset'}
                        />
                      ),
                    }}
                  >
                    {info.description}
                  </ReactMarkdown>
                ) : (
                  <p>
                    Detailed logs are currently unavailable in the database.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default InfoDetailsPage;
