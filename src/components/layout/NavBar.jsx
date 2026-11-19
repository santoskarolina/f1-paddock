import styles from './NavBar.module.css';

/** Barra fixa no topo; `children` aparece à direita (ex.: seletor de temporada). */
export function NavBar({ links, children }) {
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
      {children && <div className={styles.aside}>{children}</div>}
    </nav>
  );
}
