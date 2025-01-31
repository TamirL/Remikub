import type { N } from "vitest/dist/chunks/environment.d8YfPkTm.js";
import type { Board, CardRun, CardNumberGroup, CardSlotData, BoardWithVisibility, VisibilityOf } from "../board";
import type { NumberCardColor, RealCardData, RealJokerCardData } from "../card";
import type DeckManager from "./deckManager.svelte";
import type UserCardsManager from "./userCardsManager.svelte";
import { compare } from "../../utils/comparatorUtils";
import { groupBy, groupByToMap } from "../../utils/arrayUtils";

class BoardManager {
    private _board: Board = $state({ runs: [], numberGroups: [] });
    private _isBoardValid: boolean = $derived.by(() => BoardManager.calcIsBoardValid(this._board));

    constructor(board: Board) {
        this._board = board;
    }

    get board(): Board {
        return this._board;
    }

    getMinimalVisibleBoard(currentlyDraggedCard: RealCardData | null): Board {
        return {
            numberGroups: BoardManager.getOnlyBoardsNumberThatShouldBeVisible(this._board.numberGroups, currentlyDraggedCard),
            runs: BoardManager.getOnlyBoardsRunsThatShouldBeVisible(this._board.runs, currentlyDraggedCard)
        };
    }

    static getOnlyBoardsNumberThatShouldBeVisible(numberGroups: CardNumberGroup[], currentlyDraggedCard: RealCardData | null): CardNumberGroup[] {
        const groupedNumberGroups = groupByToMap(numberGroups, numberGroup => numberGroup.numericValue);
        return [...groupedNumberGroups.entries()].flatMap(([number, numberGroups]) => {
            return BoardManager.calcWhichNumberGroupsOfTheSameNumberToShow(number, numberGroups, currentlyDraggedCard);
        }).sort(compare.byField(numberGroup => numberGroup.id, compare.numbers()));
    }

    private static calcWhichNumberGroupsOfTheSameNumberToShow(num: number, slotSets: CardNumberGroup[], card: RealCardData | null): CardNumberGroup[] {
        const slotsThatHaveSomeCard = slotSets.filter(slotSet => slotSet.slots.some(slot => slot.card));

        if (card === null) {
            return slotsThatHaveSomeCard;
        }

        switch (card.type) {
            case 'number': {
                if (num !== card.numericValue) {
                    return slotsThatHaveSomeCard;
                }

                return slotSets.slice(0, Math.min(slotsThatHaveSomeCard.length + 1, slotSets.length));
            }
            case 'joker': {
                if (slotsThatHaveSomeCard.length === 0) {
                    return [slotSets[0]];
                }
                return slotsThatHaveSomeCard;
            }
        }
    }

    static getOnlyBoardsRunsThatShouldBeVisible(runs: CardRun[], currentlyDraggedCard: RealCardData | null): CardRun[] {
        const groupedRuns = groupByToMap(runs, run => run.color);
        return [...groupedRuns.entries()].flatMap(([runColor, runs]) => {
            return BoardManager.calcWhichRunsOfTheSameColorToShow(runColor, runs, currentlyDraggedCard)
                .map((_, index) => runs[index]);
        }).sort(compare.byField(run => run.id, compare.numbers()));
    }

    private static calcWhichRunsOfTheSameColorToShow(runColor: NumberCardColor, runs: CardRun[], card: RealCardData | null): CardRun[] {
        const slotsThatHaveSomeCard = runs.filter(slotSet => slotSet.slots.some(slot => slot.card));

        if (card === null) {
            return slotsThatHaveSomeCard;
        }
        
        switch (card.type) {
            case 'number': {
                if (runColor !== card.color) {
                    return slotsThatHaveSomeCard;
                }

                return runs.slice(0, Math.min(slotsThatHaveSomeCard.length + 1, runs.length));
            }
            case 'joker': {
                return runs.slice(0, Math.min(slotsThatHaveSomeCard.length + 1, runs.length));
            }
        }
    }

    get isBoardValid(): boolean {
        return this._isBoardValid;
    }

    private static calcIsBoardValid(board: Board): boolean {
        return board.numberGroups.every(numberGroup => this.isNumberGroupValid(numberGroup)) &&
            board.runs.every(run => this.isRunValid(run));
    }

    private static isNumberGroupValid(numberGroup: CardNumberGroup): boolean {
        const amountOfCardsInNumberGroup = numberGroup.slots.filter(slot => slot.card).length;
        // should be empty or have atleast 3 cards  
        return amountOfCardsInNumberGroup === 0 || amountOfCardsInNumberGroup >= 3;
    }

    static isRunValid(run: CardRun): boolean {
        let index = 0;
        let currentSetSize = 0;

        for (let index = 0; index < run.slots.length; index++) {
            const slot = run.slots[index];
            if (slot.card) {
                currentSetSize++;
            } else {
                if (currentSetSize !== 0 && currentSetSize < 3) {
                    // it means there is a set of cards that is under 3 cards
                    return false;
                }
                currentSetSize = 0;
            }
        }

        // if there is a set of cards that is under 3 cards, it means the run is invalid
        return currentSetSize < 3;
    }
}

export default BoardManager;