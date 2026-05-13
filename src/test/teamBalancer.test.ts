import type { PlayerSnapshot } from '@/pages/dashboard/types/match.types';
import { balanceTeams } from '@/pages/dashboard/utils/teamBalancer.utils';
import type { PlayerStats } from '@/pages/statistics/types/playerStats.types';
import { describe, it, expect } from 'vitest';

const makePlayerSnaphot = (id: string): PlayerSnapshot => ({
  id,
  name: 'Player',
  lastName: id,
});

const makeStats = (
  playerId: string,
  winRate: number,
  avgPoints: number,
  goalDifference: number,
  matches = 3,
): PlayerStats => ({
  playerId,
  name: 'Player',
  lastName: playerId,
  matches,
  wins: 0,
  losses: 0,
  draws: 0,
  points: 0,
  avgPoints,
  winRate,
  goalsScored: 0,
  avgGoalsScored: 0,
  goalsConceded: 0,
  avgGoalsConceded: 0,
  goalDifference,
});

describe('balance teams', () => {
  it('random: distributes all players between teams', () => {
    const snapshots = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(makePlayerSnaphot);
    const { teamA, teamB } = balanceTeams(snapshots, [], 'random');

    expect(teamA.length + teamB.length).toBe(8);
    expect([...teamA, ...teamB].sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].sort());
  });

  it('random: teamA gets extra player when odd number of players', () => {
    const snapshots = ['a', 'b', 'c', 'd', 'e'].map(makePlayerSnaphot);
    const { teamA, teamB } = balanceTeams(snapshots, [], 'random');

    expect(teamA.length).toBe(3);
    expect(teamB.length).toBe(2);
  });

  it('winRate: balances teams by win rate', () => {
    const snapshots = ['a', 'b', 'c', 'd'].map(makePlayerSnaphot);
    const stats = [
      makeStats('a', 100, 3, 10),
      makeStats('b', 75, 2.5, 5),
      makeStats('c', 50, 1.5, 0),
      makeStats('d', 25, 1, -5),
    ];

    const { teamA, teamB, playerRatings } = balanceTeams(snapshots, stats, 'winRate');

    expect(teamA.length + teamB.length).toBe(4);
    expect(playerRatings).toHaveLength(4);

    const ratingA = playerRatings!.find((r) => r.playerId === 'a');
    const ratingD = playerRatings!.find((r) => r.playerId === 'd');
    expect(ratingA!.rating).toBeGreaterThan(ratingD!.rating);
  });

  it('winRate: players with less than 2 matches get neutral rating', () => {
    const snapshots = ['a', 'b'].map(makePlayerSnaphot);
    const stats = [makeStats('a', 100, 3, 10, 1), makeStats('b', 0, 0, -10, 1)];

    const { playerRatings } = balanceTeams(snapshots, stats, 'winRate');

    expect(playerRatings![0].hasEnoughMatches).toBe(false);
    expect(playerRatings![0].rating).toBe(0.33);
    expect(playerRatings![1].hasEnoughMatches).toBe(false);
  });

  it('powerIndex: ratings are between 0 and 1', () => {
    const snapshots = ['a', 'b', 'c', 'd'].map(makePlayerSnaphot);
    const stats = [
      makeStats('a', 100, 3, 20),
      makeStats('b', 50, 1.5, 0),
      makeStats('c', 25, 1, -10),
      makeStats('d', 0, 0, -20),
    ];

    const { playerRatings } = balanceTeams(snapshots, stats, 'powerIndex');

    playerRatings!.forEach((r) => {
      expect(r.rating).toBeGreaterThanOrEqual(0);
      expect(r.rating).toBeLessThanOrEqual(1);
    });
  });

  it('snake draft produces balanced teams', () => {
    const snapshots = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(makePlayerSnaphot);
    const stats = [
      makeStats('a', 100, 3, 20),
      makeStats('b', 87, 2.5, 15),
      makeStats('c', 75, 2, 10),
      makeStats('d', 62, 1.8, 5),
      makeStats('e', 50, 1.5, 0),
      makeStats('f', 37, 1, -5),
      makeStats('g', 25, 0.8, -10),
      makeStats('h', 12, 0.3, -15),
    ];

    const { teamA, teamB, playerRatings } = balanceTeams(snapshots, stats, 'winRate');

    const sumA = teamA.reduce((sum, id) => {
      return sum + (playerRatings!.find((r) => r.playerId === id)?.rating ?? 0);
    }, 0);
    const sumB = teamB.reduce((sum, id) => {
      return sum + (playerRatings!.find((r) => r.playerId === id)?.rating ?? 0);
    }, 0);

    expect(Math.abs(sumA - sumB)).toBeLessThan(0.5);
  });
});
