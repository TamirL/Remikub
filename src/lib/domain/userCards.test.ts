import { extractRuns } from './userCards';
import type { RealCardData } from './cards';
import { describe, expect, it } from 'vitest';

describe('extractRuns', () => {
    it('should extract runs of at least 3 cards of the same color', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 2 },
            { id: 3, type: 'number', color: 'red', numericValue: 3 },
            { id: 4, type: 'number', color: 'blue', numericValue: 4 },
            { id: 5, type: 'number', color: 'blue', numericValue: 5 },
        ];

        const result = extractRuns(cards);

        const expectedSets: RealCardData[][] = [
            [
                { id: 1, type: 'number', color: 'red', numericValue: 1 },
                { id: 2, type: 'number', color: 'red', numericValue: 2 },
                { id: 3, type: 'number', color: 'red', numericValue: 3 },
            ],
        ];
        expect(result.sets).toEqual(expectedSets);

        const expectedOtherCards: RealCardData[] = [
            { id: 4, type: 'number', color: 'blue', numericValue: 4 },
            { id: 5, type: 'number', color: 'blue', numericValue: 5 },
        ];
        expect(result.otherCards).toEqual(expectedOtherCards);
    });

    it('should put a misfit card into "other cards" when it is surrounded by valid runs', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 2 },
            { id: 3, type: 'number', color: 'red', numericValue: 3 },
            { id: 5, type: 'number', color: 'red', numericValue: 5 },
            { id: 7, type: 'number', color: 'red', numericValue: 7 },
            { id: 8, type: 'number', color: 'red', numericValue: 8 },
            { id: 9, type: 'number', color: 'red', numericValue: 9 },
        ];

        const result = extractRuns(cards);

        const expectedSets: RealCardData[][] = [
            [
                { id: 1, type: 'number', color: 'red', numericValue: 1 },
                { id: 2, type: 'number', color: 'red', numericValue: 2 },
                { id: 3, type: 'number', color: 'red', numericValue: 3 },
            ],
            [
                { id: 7, type: 'number', color: 'red', numericValue: 7 },
                { id: 8, type: 'number', color: 'red', numericValue: 8 },
                { id: 9, type: 'number', color: 'red', numericValue: 9 },
            ],
        ];
        expect(result.sets).toEqual(expectedSets);

        const expectedOtherCards: RealCardData[] = [
            { id: 5, type: 'number', color: 'red', numericValue: 5 },
        ];
        expect(result.otherCards).toEqual(expectedOtherCards);
    });

    it('should handle multiple runs and leftovers correctly', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 2 },
            { id: 3, type: 'number', color: 'red', numericValue: 3 },
            { id: 4, type: 'number', color: 'blue', numericValue: 4 },
            { id: 5, type: 'number', color: 'blue', numericValue: 5 },
            { id: 6, type: 'number', color: 'blue', numericValue: 6 },
            { id: 7, type: 'number', color: 'blue', numericValue: 8 },
        ];

        const result = extractRuns(cards);

        const expectedSets: RealCardData[][] = [
            [
                { id: 1, type: 'number', color: 'red', numericValue: 1 },
                { id: 2, type: 'number', color: 'red', numericValue: 2 },
                { id: 3, type: 'number', color: 'red', numericValue: 3 },
            ],
            [
                { id: 4, type: 'number', color: 'blue', numericValue: 4 },
                { id: 5, type: 'number', color: 'blue', numericValue: 5 },
                { id: 6, type: 'number', color: 'blue', numericValue: 6 },
            ],
        ];
        expect(result.sets).toEqual(expectedSets);

        const expectedOtherCards: RealCardData[] = [
            { id: 7, type: 'number', color: 'blue', numericValue: 8 },
        ];
        expect(result.otherCards).toEqual(expectedOtherCards);
    });

    it('should handle no runs correctly', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 3 },
            { id: 3, type: 'number', color: 'blue', numericValue: 5 },
        ];

        const result = extractRuns(cards);

        expect(result.sets).toEqual([]);
        expect(result.otherCards).toEqual(cards);
    });

    it('should handle non-number cards correctly', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 2 },
            { id: 3, type: 'number', color: 'red', numericValue: 3 },
            { id: 4, type: 'joker', color: 'black' },
        ] as any[];

        const result = extractRuns(cards);

        const expectedSets: RealCardData[][] = [
            [
                { id: 1, type: 'number', color: 'red', numericValue: 1 },
                { id: 2, type: 'number', color: 'red', numericValue: 2 },
                { id: 3, type: 'number', color: 'red', numericValue: 3 },
            ],
        ];
        expect(result.sets).toEqual(expectedSets);

        const expectedOtherCards: RealCardData[] = [
            { id: 4, type: 'joker', color: 'black' },
        ];
        expect(result.otherCards).toEqual(expectedOtherCards);
    });

    it('should handle empty input', () => {
        const cards: RealCardData[] = [];
        const result = extractRuns(cards);
        expect(result.sets).toEqual([]);
        expect(result.otherCards).toEqual([]);
    });

    it('should only sets in cards', () => {
        const cards: RealCardData[] = [
            { id: 1, type: 'number', color: 'red', numericValue: 1 },
            { id: 2, type: 'number', color: 'red', numericValue: 2 },
            { id: 3, type: 'number', color: 'red', numericValue: 3 },
        ];

        const result = extractRuns(cards);

        expect(result.sets).toEqual([cards]);
        expect(result.otherCards).toEqual([]);
    });
});