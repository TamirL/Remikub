import { groupByToMap } from "$lib/utils/arrayUtils";
import type { Comparator } from "$lib/utils/comparatorUtils";
import { isRealNumberCardData, type RealCardData, type RealNumberCardData } from "./cards";

export type UserCardId = number | null;
export type UserCard = RealCardData | null;

export type UserCardsOrdered = {
    sets: RealCardData[][],
    otherCards: RealCardData[],
}

export function orderUserCardsBySameComparator(userCards: UserCardsOrdered, comparator: Comparator<RealCardData>): UserCardsOrdered {
    return {
        sets: userCards.sets.map(set => set.toSorted(comparator)),
        otherCards: userCards.otherCards.toSorted(comparator),
    }
}

export function extractNumberGroups(userCards: RealCardData[]): UserCardsOrdered {
    const validGroups: RealCardData[][] = [];
    const leftovers: RealCardData[] = [];

    // Group only number cards by their numeric value.
    const numberCardsByValue = new Map<number, RealNumberCardData[]>();

    for (const card of userCards) {
        if (card.type === 'number') {
            if (!numberCardsByValue.has(card.numericValue)) {
                numberCardsByValue.set(card.numericValue, []);
            }
            numberCardsByValue.get(card.numericValue)!.push(card);
        } else {
            // Non-number cards are not used to form number groups.
            leftovers.push(card);
        }
    }

    // Process each group: we want one card per distinct color.
    for (const cards of numberCardsByValue.values()) {
        const seenColors = new Set<string>();
        const group: RealCardData[] = [];
        for (const card of cards) {
            if (!seenColors.has(card.color)) {
                seenColors.add(card.color);
                group.push(card);
            } else {
                // Duplicate color – cannot use it in this group.
                leftovers.push(card);
            }
        }
        // Valid group if at least 3 distinct colors.
        if (group.length >= 3) {
            validGroups.push(group);
        } else {
            leftovers.push(...group);
        }
    }

    return { sets: validGroups, otherCards: leftovers, };
}

export function extractRuns(userCards: RealCardData[]): UserCardsOrdered {
    const onlyNumberCards = userCards.filter(isRealNumberCardData);

    // Group number cards by color (only number cards are considered for runs).
    const cardsByColor = groupByToMap(onlyNumberCards, card => card.color);

    // For each color group, sort the cards and greedily extract runs.
    for (const cardsOfColor of cardsByColor.values()) {
        const groupedByNumber = groupByToMap(cardsOfColor, card => card.numericValue);
        // const orderedCardNumbersOfColor = groupedByNumber.keys().toArray().toSorted(compare.numbers());

        let plausableSet: RealNumberCardData[] = [];
        for (let i = 1; i <= 13; i++) {
            const cardsOfNumber = groupedByNumber.get(i);
            const firstCardOfNumber = cardsOfNumber?.[0];

            if (!firstCardOfNumber) {
                if (plausableSet.length >= 3) {
                    return findOtherRunsAndMergeResults(userCards, plausableSet);
                }

                plausableSet = [];
                continue;
            }

            if (plausableSet.length === 0) {
                plausableSet.push(firstCardOfNumber);
                continue;
            }

            const lastCardInSet = plausableSet[plausableSet.length - 1];

            if (lastCardInSet.numericValue + 1 === firstCardOfNumber.numericValue) {
                plausableSet.push(firstCardOfNumber);
                continue;
            }

            if (plausableSet.length >= 3) {
                return findOtherRunsAndMergeResults(userCards, plausableSet);
            }

            // The card is not part of the previous plausable set, and the previous plausable set
            // was too short
            plausableSet = [firstCardOfNumber];
        }
    }

    // If we made it to here, it means that there are no more sets left in the user cards
    return { sets: [], otherCards: userCards };
}

function findOtherRunsAndMergeResults(userCards: RealCardData[], foundSet: RealNumberCardData[]) {
    const idsOfSet = new Set(foundSet.map(card => card.id));
    const userCardsWithoutSet = userCards.filter(card => card === null || !idsOfSet.has(card.id));
    const extractedSetsOfOtherCards = extractRuns(userCardsWithoutSet);

    return {
        sets: [foundSet, ...extractedSetsOfOtherCards.sets],
        otherCards: extractedSetsOfOtherCards.otherCards,
    };
}