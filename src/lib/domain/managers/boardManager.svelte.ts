import type { Board, CardRun, CardNumberGroup } from "../board";
import type { NumberCardColor, RealCardData } from "../card";
import { compare } from "$lib/utils/comparatorUtils";
import { groupByToMap } from "$lib/utils/arrayUtils";

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

    private static calcWhichNumberGroupsOfTheSameNumberToShow(num: number, numberGroups: CardNumberGroup[], currentlyDraggedCard: RealCardData | null): CardNumberGroup[] {
        const setsThatHaveACard = numberGroups.filter(slotSet => slotSet.slots.some(slot => slot.card));

        if (!currentlyDraggedCard) {
            return setsThatHaveACard;
        }

        // The dragged card is irrelevant for this number group
        if (currentlyDraggedCard.type === 'number' && currentlyDraggedCard.numericValue !== num) {
            return setsThatHaveACard;
        }

        // In case the dragged card is a joker or a number of this number group,
        // we show all number groups of this number + a new empty number group set if available
        return numberGroups.slice(0, Math.min(setsThatHaveACard.length + 1, numberGroups.length));
    }

    static getOnlyBoardsRunsThatShouldBeVisible(runs: CardRun[], currentlyDraggedCard: RealCardData | null): CardRun[] {
        const groupedRuns = groupByToMap(runs, run => run.color);
        return [...groupedRuns.entries()].flatMap(([runColor, runs]) => {
            return BoardManager.calcWhichRunsOfTheSameColorToShow(runColor, runs, currentlyDraggedCard)
                .map((_, index) => runs[index]);
        }).sort(compare.byField(run => run.id, compare.numbers()));
    }

    private static calcWhichRunsOfTheSameColorToShow(runColor: NumberCardColor, runs: CardRun[], currentlyDraggedCard: RealCardData | null): CardRun[] {
        const setsThatHaveACard = runs.filter(slotSet => slotSet.slots.some(slot => slot.card));

        if (!currentlyDraggedCard) {
            return setsThatHaveACard;
        }

        // The dragged card is irrelevant for this run because it is not of the same color
        if (currentlyDraggedCard.type === 'number' && currentlyDraggedCard.color !== runColor) {
            return setsThatHaveACard;
        }

        // In case the dragged card is a joker or a number of this run,
        // we show all runs of this color + a new empty run set if available
        return runs.slice(0, Math.min(setsThatHaveACard.length + 1, runs.length));
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
        return currentSetSize === 0 || currentSetSize >= 3;
    }
}

export default BoardManager;