import styles from './DriverAvatar.module.css';

const DRIVERS_PHOTO = {
  'ocon': '/drivers/ocon.avif',
  'rafael_camara': '/drivers/rafael_camara.avif',
  'tsunoda': '/drivers/tsunoda.png',
  'ryo_hirakawa': '/drivers/hirakawa.jpg',
  'arvid_lindblad': '/drivers/arvid_lindblad.avif',
  'senna': '/drivers/senna.jfif',
  'michael_schumacher': '/drivers/michael_schumacher.jfif',
  'alonso': '/drivers/alonso.jfif',
  'barrichello': '/drivers/barrichello.jpg',
}

/**
 * A OpenF1 entrega a menor versão da foto (".transform/1col/", 93 px).
 * O servidor da F1 tem outras: 2col = 206 px e 4col = 432 px.
 * Avatares pequenos usam 2col (nítido em telas 2x); os grandes, como a carta, usam 4col.
 */
function headshotForSize(url, size) {
  if (!url) return null;
  const variant = typeof size === 'number' && size <= 100 ? '2col' : '4col';
  return url.replace(/\.transform\/\w+\//, `.transform/${variant}/`);
}

/** Foto local ou da OpenF1; se não existir, mostra o número na cor da equipe. */
export function DriverAvatar({ driver, size = 72, className = '' }) {
  const photo = DRIVERS_PHOTO[driver.id] ?? headshotForSize(driver.headshotUrl, size);

  return (
    <div className={`${styles.avatar} ${className}`} style={{ '--team': driver.color, width: size, height: size }}>
      {photo ? (
        <img
          src={photo}
          alt={`Foto de ${driver.name}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={styles.number}>{driver.number ?? driver.code}</span>
      )}
    </div>
  );
}
