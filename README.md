# Paddock — Temporada de F1 em números

Site em React (Vite) com classificação, probabilidades, grid de pilotos com foto, construtores e calendário
da temporada atual de Fórmula 1, tudo com dados ao vivo.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/ para publicar
```

## Fontes de dados

| API | Uso | Endpoints |
| --- | --- | --- |
| [Jolpica-F1](https://github.com/jolpica/jolpica-f1) | classificações, calendário e pódios | `/current/driverstandings`, `/current/constructorstandings`, `/current/races`, `/current/results/{1,2,3}` |
| [OpenF1](https://openf1.org) | fotos (`headshot_url`) e cores das equipes | `/drivers?session_key=latest` |
| [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits) (MIT) | traçado, extensão, altitude e ano do 1º GP de cada circuito | arquivo local `src/data/circuits.json` |
| [world-atlas](https://github.com/topojson/world-atlas) (Natural Earth) | contorno dos continentes no mapa | pacote npm |

Cada corrida da Jolpica é ligada ao seu traçado pelas coordenadas do circuito (o mais próximo num raio de 5 km),
então não é preciso manter uma tabela de IDs entre as fontes. Se um circuito novo ainda não existir no
`circuits.json`, o site simplesmente não mostra o traçado dele.

As respostas ficam em cache por 10 minutos (memória + `localStorage`) e as chamadas à Jolpica são feitas em
sequência, com nova tentativa em caso de HTTP 429, para respeitar o limite de requisições.
Se a OpenF1 falhar, o site continua funcionando e mostra o número do piloto no lugar da foto.

## Como as probabilidades são calculadas

As chances de título, vice, vitória e pódio na próxima corrida vêm de uma simulação de Monte Carlo
(`src/domain/simulation.js`): o restante da temporada é "corrido" 10.000 vezes e cada probabilidade é a
fração das simulações em que aquilo aconteceu.

1. **Força de cada piloto.** A partir da média de pontos por corrida já disputada:

   ```
   força = (pontos / corridas disputadas + 0,3) ^ 3
   ```

   O expoente 3 faz o favorito dominar mais cada corrida; o piso de 0,3 garante que nenhum piloto fique com
   chance exatamente zero.

2. **Ordem de chegada.** Em cada corrida simulada, a ordem é sorteada pelo modelo de **Plackett-Luce**: a
   chance de um piloto vencer é a sua força dividida pela soma das forças de todos; o 2º lugar é sorteado da
   mesma forma entre os que sobraram, e assim por diante. Na prática isso é feito com o *truque de Gumbel*:
   soma-se um ruído de Gumbel ao logaritmo da força de cada piloto e ordena-se do maior para o menor.

3. **Pontuação.** Cada corrida restante distribui os pontos oficiais (25-18-15-12-10-8-6-4-2-1) e cada
   sprint restante distribui 8-7-6-5-4-3-2-1, somados aos pontos que cada piloto já tem.

4. **Contagem.** Ao fim de cada temporada simulada, o 1º colocado ganha um "título" e o 2º um "vice". A
   primeira corrida simulada também conta quem venceu e quem subiu ao pódio, o que gera as chances da
   próxima etapa. Dividindo as contagens por 10.000, chega-se às porcentagens.

O gerador de números aleatórios usa uma semente fixa (mulberry32, semente `2026`), então os resultados são
reproduzíveis e não mudam a cada renderização, só quando os dados da temporada mudam. Os parâmetros
(`iterations`, `strengthExponent`, `strengthFloor`, `seed`) ficam em `SIMULATION`, no
`src/config/constants.js`.

**Limitações:** o modelo não considera abandonos, punições, desempenho recente, características de cada
circuito nem critérios de desempate. É uma estimativa baseada na pontuação até aqui, não uma previsão.

## Estrutura

```
src/
├── data/          circuits.json (traçados) e a licença MIT do projeto de origem
├── config/        constantes (URLs, tabela de pontos, parâmetros da simulação) e cores das equipes
├── services/      acesso às APIs (http com cache, jolpica, openf1) e montagem do modelo da temporada
├── domain/        regras puras, sem React: resumo da temporada, duelos, simulação e geometria dos traçados
├── hooks/         useSeason, useSimulation, useCountdown, useHoverCard, useElementWidth, usePrefersReducedMotion
├── utils/         formatação (pt-BR) e bandeiras
├── components/
│   ├── ui/        peças genéricas: Section, ProgressBar, HoverCard, SegmentedControl, StatusMessage, Flag
│   └── layout/    NavBar
└── features/      uma pasta por área do site
    ├── hero/          manchete, líder, contagem regressiva e números da temporada
    ├── season/        faixa com o vencedor de cada etapa
    ├── standings/     torre de cronometragem
    ├── probabilities/ chances de título/vice e da próxima corrida
    ├── drivers/       cartões, avatar com foto e cartão flutuante do piloto
    ├── teams/         construtores e duelos entre companheiros
    ├── circuits/      traçado do circuito em SVG, com carro animado
    ├── calendar/      mapa-múndi interativo, lista de etapas e ficha da corrida (modal)
    └── dashboard/     composição da página
```

Princípios seguidos:

- **Camadas separadas:** componentes não chamam APIs; `services` busca e normaliza, `domain` calcula,
  `hooks` conectam isso ao React e `features` só exibem.
- **Modelo próprio:** o formato das APIs fica isolado em `seasonService.js`. Se uma API mudar, só ele muda.
- **Funções puras e testáveis:** simulação e estatísticas não dependem de React nem do navegador.
- **Componentes pequenos e reutilizáveis:** `HoverCard` + `useHoverCard` servem para qualquer tooltip,
  `ProgressBar` para todas as barras.
- **Carregamento sob demanda:** o mapa e os traçados ficam em arquivos separados do bundle principal
  (`React.lazy` e `import()` dinâmico).
- **CSS Modules** ao lado de cada componente, com tokens de tema em `styles/global.css` (claro e escuro).

## Aviso

Site de fã, sem ligação oficial com a Fórmula 1 ou a FIA. As fotos dos pilotos pertencem à Formula 1.
