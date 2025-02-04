import { describe, it, expect, beforeEach } from 'vitest';
import GameManager from '../gameManager.svelte';
import type { Board, CardRun } from '../../board';

describe('GameManager.isRunValid', () => {
    let gameManager: GameManager;

    beforeEach(() => {
        gameManager = new GameManager({ board: { runs: [], numberGroups: [] }, id: '1', players: [], deckSize: 0, userCards: [] });
    });

    // Helper function to create a run with a pattern of filled/empty slots
    function createTestRun(pattern: boolean[]): CardRun {
        return {
            id: 1,
            color: 'yellow',
            slots: pattern.map((hasCard, index) => ({
                card: hasCard ? { type: 'number', id: index + 1, color: 'yellow', numericValue: index + 1 } : null,
                expectedCard: { type: 'number', color: 'yellow', numericValue: index + 1 }
            })),
        };
    }

    it('should return true for an empty run', () => {
        const run = createTestRun([false, false, false]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a single set of 3 cards', () => {
        const run = createTestRun([true, true, true]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a single set of more than 3 cards', () => {
        const run = createTestRun([true, true, true, true, true]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });

    it('should return false for a set of 2 cards', () => {
        const run = createTestRun([true, true]);
        expect(GameManager.isRunValid(run)).toBe(false);
    });

    it('should return true for multiple valid sets separated by gaps', () => {
        const run = createTestRun([
            true, true, true, false, false,
            true, true, true, true
        ]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });

    it('should return false if there is an invalid set in the middle', () => {
        const run = createTestRun([
            true, true, true, false,
            true, true, // Invalid set of 2
            false, true, true, true
        ]);
        expect(GameManager.isRunValid(run)).toBe(false);
    });

    it('should return false if there is an invalid set at the end', () => {
        const run = createTestRun([
            true, true, true, false,
            true, true // Invalid set of 2 at the end
        ]);
        expect(GameManager.isRunValid(run)).toBe(false);
    });

    it('should return true for a run with trailing empty slots', () => {
        const run = createTestRun([true, true, true, false, false]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a run with leading empty slots', () => {
        const run = createTestRun([false, false, true, true, true]);
        expect(GameManager.isRunValid(run)).toBe(true);
    });
}); 