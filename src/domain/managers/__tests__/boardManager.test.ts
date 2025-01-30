import { describe, it, expect, beforeEach } from 'vitest';
import BoardManager from '../boardManager.svelte';
import type { Board, CardRun, CardSlotData } from '../../board';

describe('BoardManager.isRunValid', () => {
    let boardManager: BoardManager;

    beforeEach(() => {
        boardManager = new BoardManager({ allRuns: [], sets: [] });
    });

    // Helper function to create a run with a pattern of filled/empty slots
    function createTestRun(pattern: boolean[]): CardRun {
        return {
            color: 'yellow',
            slots: pattern.map(hasCard => ({
                card: hasCard ? { type: 'number', id: 1, color: 'yellow', numericValue: 1 } : null,
                expectedCard: { type: 'number', color: 'yellow', numericValue: 1 }
            }))
        };
    }

    it('should return true for an empty run', () => {
        const run = createTestRun([false, false, false]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a single sequence of 3 cards', () => {
        const run = createTestRun([true, true, true]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a single sequence of more than 3 cards', () => {
        const run = createTestRun([true, true, true, true, true]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });

    it('should return false for a sequence of 2 cards', () => {
        const run = createTestRun([true, true]);
        expect(BoardManager.isRunValid(run)).toBe(false);
    });

    it('should return true for multiple valid sequences separated by gaps', () => {
        const run = createTestRun([
            true, true, true, false, false,
            true, true, true, true
        ]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });

    it('should return false if there is an invalid sequence in the middle', () => {
        const run = createTestRun([
            true, true, true, false,
            true, true, // Invalid sequence of 2
            false, true, true, true
        ]);
        expect(BoardManager.isRunValid(run)).toBe(false);
    });

    it('should return false if there is an invalid sequence at the end', () => {
        const run = createTestRun([
            true, true, true, false,
            true, true // Invalid sequence of 2 at the end
        ]);
        expect(BoardManager.isRunValid(run)).toBe(false);
    });

    it('should return true for a run with trailing empty slots', () => {
        const run = createTestRun([true, true, true, false, false]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });

    it('should return true for a run with leading empty slots', () => {
        const run = createTestRun([false, false, true, true, true]);
        expect(BoardManager.isRunValid(run)).toBe(true);
    });
}); 