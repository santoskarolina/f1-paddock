import styles from './DriverAvatar.module.css';

const DRIVERS_PHOTO = {
  'ocon': 'public/drivers/ocon.avif',
  'rafael_camara': 'public/drivers/rafael_camara.avif',
  'tsunoda': 'public/drivers/tsunoda.png',
  'ryo_hirakawa': 'public/drivers/hirakawa.jpg',
  'arvid_lindblad': 'public/drivers/arvid_lindblad.avif'
}

/** Foto da OpenF1; se não existir ou não carregar, mostra o número na cor da equipe. */
export function DriverAvatar({ driver, size = 72 }) {
  const showPhoto = DRIVERS_PHOTO[driver.id] || driver.headshotUrl;
  
  return (
    <div className={styles.avatar} style={{ '--team': driver.color, width: size, height: size }}>
      {showPhoto ? (
        <img
          src={DRIVERS_PHOTO[driver.id] || driver.headshotUrl}
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
