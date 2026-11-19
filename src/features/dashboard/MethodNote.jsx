import styles from './MethodNote.module.css';

export function MethodNote() {
  return (
    <details className={styles.note}>
      <summary>Como as probabilidades são calculadas e de onde vêm os dados</summary>
      <p>
        Cada piloto recebe uma força igual ao cubo da sua média de pontos por corrida. Em cada corrida simulada, a ordem
        de chegada é sorteada proporcionalmente a essa força e os pontos oficiais são distribuídos, inclusive nas sprints
        que faltarem. O modelo ignora abandonos, punições e a fase recente: é uma estimativa, não uma previsão.
      </p>
      <p>
        Classificações, calendário e pódios vêm da API Jolpica-F1 (sucessora da Ergast). Fotos e cores oficiais vêm da
        OpenF1. Os traçados e as coordenadas dos circuitos vêm do projeto aberto bacinger/f1-circuits (licença MIT), e o
        contorno dos continentes, do world-atlas (Natural Earth). As imagens dos pilotos pertencem à Formula 1; este é um site de fã, sem ligação oficial com a F1 ou a FIA.
      </p>
    </details>
  );
}
