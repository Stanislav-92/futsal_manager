import type { PlayerContact } from '@/pages/contacts/types/player.types';
import type { Match } from '@/pages/dashboard/types/match.types';
import { calculatePlayerStats } from '@/pages/statistics/utils/playerStats.utils';
import { describe, expect, it } from 'vitest';

const makePlayer = (id: string): PlayerContact => ({
  id,
  name: 'Player',
  lastName: id,
  email: `${id}@test.com`,
  phone: '123456789',
  matches: 0,
});

const makeMatch = (
  id: string,
  teamA: string[],
  teamB: string[],
  scoreA: number,
  scoreB: number,
  players: string[],
): Match => ({
  id,
  date: '2026-01-01',
  status: 'completed',
  playerSnapshots: players.map((playerId) => ({
    id: playerId,
    name: 'Player',
    lastName: playerId,
  })),
  teamA,
  teamB,
  result: { scoreA, scoreB },
});

describe('calculatePlayerStats', () => {
  it('counts wins, losses, draws correctly', () => {
    const players = [makePlayer('a'), makePlayer('b')];
    const matches = [
      makeMatch('1', ['a'], ['b'], 3, 1, ['a', 'b']),
      makeMatch('2', ['a'], ['b'], 1, 1, ['a', 'b']),
      makeMatch('3', ['b'], ['a'], 3, 1, ['a', 'b']),
    ];

    const stats = calculatePlayerStats(players, matches);
    const statsA = stats.find((s) => s.playerId === 'a')!;
    const statsB = stats.find((s) => s.playerId === 'b')!;

    expect(statsA.wins).toBe(1);
    expect(statsA.losses).toBe(1);
    expect(statsA.draws).toBe(1);
    expect(statsA.matches).toBe(3);

    expect(statsB.wins).toBe(1);
    expect(statsB.losses).toBe(1);
    expect(statsB.draws).toBe(1);
  });

  it('calculates points correctly (3 win, 1 draw, 0 loss)', () => {
    const players = [makePlayer('a')];
    const matches = [
      makeMatch('1', ['a'], ['b'], 3, 1, ['a', 'b']),
      makeMatch('2', ['a'], ['b'], 1, 1, ['a', 'b']),
      makeMatch('3', ['b'], ['a'], 3, 1, ['a', 'b']),
    ];

    const stats = calculatePlayerStats(players, matches);
    const statsA = stats.find((s) => s.playerId === 'a')!;

    expect(statsA.points).toBe(4);
  });

  it('calculates goals scored and conceded correctly', () => {
    const players = [makePlayer('a')];
    const matches = [
      makeMatch('1', ['a'], ['b'], 5, 2, ['a', 'b']),
      makeMatch('2', ['b'], ['a'], 3, 4, ['a', 'b']),
    ];

    const stats = calculatePlayerStats(players, matches);
    const statsA = stats.find((s) => s.playerId === 'a')!;

    expect(statsA.goalsScored).toBe(9);
    expect(statsA.goalsConceded).toBe(5);
    expect(statsA.goalDifference).toBe(4);
  });

  it('calculates win rate correctly', () => {
    const players = [makePlayer('a')];
    const matches = [
      makeMatch('1', ['a'], ['b'], 3, 1, ['a', 'b']),
      makeMatch('2', ['a'], ['b'], 3, 1, ['a', 'b']),
      makeMatch('3', ['b'], ['a'], 3, 1, ['a', 'b']),
      makeMatch('4', ['b'], ['a'], 3, 1, ['a', 'b']),
    ];

    const stats = calculatePlayerStats(players, matches);
    const statsA = stats.find((s) => s.playerId === 'a')!;

    expect(statsA.winRate).toBe(50);
  });

  it('ignores non-completed matches', () => {
    const players = [makePlayer('a')];
    const openMatch: Match = {
      id: '1',
      date: '2026-01-01',
      status: 'open',
      playerSnapshots: [{ id: 'a', name: 'Player', lastName: 'a' }],
      teamA: ['a'],
      teamB: ['b'],
    };

    const stats = calculatePlayerStats(players, [openMatch]);
    const statsA = stats.find((s) => s.playerId === 'a')!;

    expect(statsA.matches).toBe(0);
  });

  it('returns zero stats for player with no matches', () => {
    const players = [makePlayer('a')];
    const stats = calculatePlayerStats(players, []);
    const statsA = stats.find((s) => s.playerId === 'a')!;

    expect(statsA.matches).toBe(0);
    expect(statsA.winRate).toBe(0);
    expect(statsA.points).toBe(0);
  });
});
