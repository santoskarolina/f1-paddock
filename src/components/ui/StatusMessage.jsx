import styles from './StatusMessage.module.css';

/** Mensagem centralizada (carregando, erro, vazio). `visual` aparece acima do título. */
export function StatusMessage({ title, detail, actionLabel, onAction, visual }) {
  return (
    <div className={styles.wrapper} role="status">
      {visual}
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
