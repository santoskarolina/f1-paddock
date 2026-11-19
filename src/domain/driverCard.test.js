import { describe, expect, it } from 'vitest';
import { buildDriverCard, buildFlavorText, normalize, pickMoves, rarityForPosition } from './driverCard';

const makeDriver = (overrides) => ({
  id: 'piloto',
  code: 'PIL',
  number: '7',
  name: 'Piloto Teste',
  nationalityIso: 'BR',
  position: 1,
  points: 0,
  wins: 0,
  podiums: 0,
  team: { id: 'equipe', name: 'Equipe X' },
  color: '#ff0000',
  headshotUrl: null,
  ...overrides,
});

const leader = makeDriver({ code: 'LID', position: 1, points: 200, wins: 5, podiums: 8 });
const second = makeDriver({ code: 'SEG', position: 2, points: 150, wins: 2, podiums: 6 });
const backmarker = makeDriver({ code: 'FIM', position: 20, points: 0, wins: 0, podiums: 0 });
const grid = [leader, second, backmarker];

describe('rarityForPosition', () => {
  it.each([
    [1, 'Lendária'],
    [2, 'Épica'],
    [3, 'Épica'],
    [4, 'Rara'],
    [10, 'Rara'],
    [11, 'Comum'],
  ])('posição %i → %s', (position, label) => {
    expect(rarityForPosition(position).label).toBe(label);
  });
});

describe('normalize', () => {
  it('dá 99 ao melhor do grid e 0 quando ninguém pontuou', () => {
    expect(normalize(10, 10)).toBe(99);
    expect(normalize(5, 10)).toBe(50);
    expect(normalize(0, 0)).toBe(0);
  });
});

describe('pickMoves', () => {
  it('escolhe os dois golpes de maior valor', () => {
    const moves = pickMoves(leader, 10);
    expect(moves.map((m) => m.name)).toEqual(['Bandeirada Final', 'Trem do Pódio']);
    expect(moves[0].value).toBe(125);
    expect(moves[1].value).toBe(120);
  });

  it('usa os golpes padrão quando o piloto não tem vitórias nem pódios', () => {
    const moves = pickMoves(makeDriver({ points: 30 }), 10);
    expect(moves.map((m) => m.name)).toEqual(['Caçador de Pontos', 'Vácuo na Reta']);
  });

  it('desempata pela ordem fixa dos golpes', () => {
    const moves = pickMoves(backmarker, 10);
    expect(moves.map((m) => m.id)).toEqual(['pointsHunter', 'slipstream']);
  });
});

describe('buildFlavorText', () => {
  it('destaca vitórias do líder', () => {
    expect(buildFlavorText(leader)).toBe('Líder do campeonato com 5 vitórias, correndo pela equipe Equipe X.');
  });

  it('lida com quem ainda não pontuou', () => {
    expect(buildFlavorText(backmarker)).toBe('Ainda em busca do primeiro ponto, correndo pela equipe Equipe X.');
  });
});

describe('buildDriverCard', () => {
  const odds = new Map([['SEG', { champion: 12.5, runnerUp: 60, winNext: 20, podiumNext: 50 }]]);
  const card = buildDriverCard(second, { completedRaces: 10, odds, allDrivers: grid });

  it('monta os dados principais da carta', () => {
    expect(card.points).toBe(150);
    expect(card.rarity.label).toBe('Épica');
    expect(card.cardNumber).toBe('2/3');
    expect(card.titleChance).toBe(12.5);
    expect(card.moves).toHaveLength(2);
  });

  it('normaliza os quatro atributos pelo melhor do grid', () => {
    const byId = Object.fromEntries(card.attributes.map((a) => [a.id, a.value]));
    expect(byId).toEqual({ pace: 74, wins: 40, podiums: 74, consistency: 74 });
    const leaderCard = buildDriverCard(leader, { completedRaces: 10, odds, allDrivers: grid });
    expect(leaderCard.attributes.every((a) => a.value === 99)).toBe(true);
  });

  it('funciona antes da primeira corrida e sem probabilidades', () => {
    const empty = buildDriverCard(backmarker, { completedRaces: 0, allDrivers: grid });
    expect(empty.attributes.every((a) => a.value === 0)).toBe(true);
    expect(empty.titleChance).toBeNull();
  });
});
