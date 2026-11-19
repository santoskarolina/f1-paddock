import styles from './StatusMessage.module.css';

export function StatusMessage({ title, detail, actionLabel, onAction }) {
  return (
    <div className={styles.wrapper} role="status">
      <p className={styles.title}>{title}</p>
      {detail && <p className={styles.detail}>{detail}</p>}
      {onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
