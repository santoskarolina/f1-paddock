import styles from './NavBar.module.css';

export function NavBar({ links }) {
  return (
    <nav className={styles.nav} aria-label="Seções">
      <span className={styles.brand}>Paddock</span>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.id}>
            <a href={`#${link.id}`}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
