import styles from './Section.module.css';

export function Section({ id, title, description, children, aside }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.header}>
        <div>
          <h2 id={`${id}-title`} className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
