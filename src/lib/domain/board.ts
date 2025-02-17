import type { B } from "vitest/dist/chunks/benchmark.CFFwLv-O.js";
import type { NumberCardColor, NumberCardData, RealCardData } from "./cards";
import type { RelevantCardsForPlayerTurn } from "./game";

export type CardSlotData = {
    id: number;
    expectedCard: NumberCardData;
    cardId: number | null;
}

export type CardNumberGroup = { id: number; numericValue: number; slots: CardSlotData[] };
export type CardRun = { id: number; color: NumberCardColor; slots: CardSlotData[] };

export type Board = {
    numberGroups: CardNumberGroup[];
    runs: CardRun[];
}

export function getAllCardsOnTheBoard(board: Board): number[] {
    const allCardsInNumberGroups = board.numberGroups.flatMap(numberGroup => numberGroup.slots.map(slot => slot.cardId)).filter(cardId => cardId !== null);
    const allCardsInRuns = board.runs.flatMap(run => run.slots.map(slot => slot.cardId)).filter(cardId => cardId !== null);
    return [...allCardsInNumberGroups, ...allCardsInRuns];
}

export function isBoardEmpty(board: Board): boolean {
    return board.numberGroups.every(numberGroup => numberGroup.slots.every(slot => slot.cardId === null)) &&
        board.runs.every(run => run.slots.every(slot => slot.cardId === null));
}

export function hasUserMadeContributionsToTheTable(currentCards: RelevantCardsForPlayerTurn, cardsAtTheStartOfTheTurn: RelevantCardsForPlayerTurn | null): boolean {
    // This parameter should always be provided when this is the turn of the player
    if (!cardsAtTheStartOfTheTurn) {
        console.log("hasUserMadeContributionsToTheTable cardsAtTheStartOfTheTurn", cardsAtTheStartOfTheTurn);
        return !isBoardEmpty(currentCards.board);
    }

    // Check the player has less cards in their hand than they did at the start of the turn
    if (currentCards.playerCardIds.length >= cardsAtTheStartOfTheTurn.playerCardIds.length) {
        console.log("hasUserMadeContributionsToTheTable currentCards.playerCardIds.length", currentCards.playerCardIds.length, cardsAtTheStartOfTheTurn.playerCardIds.length);
        return false;
    }

    const allBoardCardsAtTheStartOfTheTurn = getAllCardsOnTheBoard(cardsAtTheStartOfTheTurn.board);

    // Check no cards were moved from the board to the player hand
    if (!new Set(allBoardCardsAtTheStartOfTheTurn).isDisjointFrom(new Set(currentCards.playerCardIds))) {
        console.log("hasUserMadeContributionsToTheTable sets", new Set(allBoardCardsAtTheStartOfTheTurn), new Set(currentCards.playerCardIds));
        return false;
    }

    return true;
}

export function areBoardsEqual(board1: Board, board2: Board): boolean {
    return board1.numberGroups.length === board2.numberGroups.length &&
        board1.runs.length === board2.runs.length &&
        board1.numberGroups.every((numberGroup, index) => areNumberGroupsEqual(numberGroup, board2.numberGroups[index])) &&
        board1.runs.every((run, index) => areRunsEqual(run, board2.runs[index]));
}

function areNumberGroupsEqual(first: CardNumberGroup, second: CardNumberGroup): boolean {
    return first.id === second.id &&
        first.numericValue === second.numericValue &&
        first.slots.length === second.slots.length &&
        first.slots.every((slot, index) => areSlotsEqual(slot, second.slots[index]));
}

function areRunsEqual(first: CardRun, second: CardRun): boolean {
    return first.id === second.id &&
        first.color === second.color &&
        first.slots.length === second.slots.length &&
        first.slots.every((slot, index) => areSlotsEqual(slot, second.slots[index]));
}

function areSlotsEqual(first: CardSlotData, second: CardSlotData): boolean {
    return first.id === second.id &&
        first.expectedCard.type === second.expectedCard.type &&
        first.expectedCard.color === second.expectedCard.color &&
        first.expectedCard.numericValue === second.expectedCard.numericValue &&
        first.cardId === second.cardId;
}


