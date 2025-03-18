import { groupByToMap } from "$lib/utils/arrayUtils";
import { compare } from "$lib/utils/comparatorUtils";
import type { Board, CardNumberGroup, CardRun, CardSlotData } from "../board";
import { allCardsById, canPutRealCardOnSlot, cardByColorComparator, cardByValueComparator, cardByTypeComperator, type CardType, type JokerCardColor, type NumberCardColor, type RealCardData, type RealNumberCardData } from "../cards";
import type { CardMoveAction } from "../gameActions";
import type UpdateManager from "./updateManager.svelte";
import type { GameFromPlayerPerspective, RelevantCardsForPlayerTurn } from "../game";
import type { InProgressGameUpdate } from "../updates";
import { isDefined } from "$lib/utils/utils";
import { extractNumberGroups, extractRuns, orderUserCardsBySameComparator, type UserCard, type UserCardsOrdered } from "../userCards";
import { getAnyValue } from "$lib/utils/setUtils";

class GameManager {
    private _updateManager: UpdateManager<GameFromPlayerPerspective, InProgressGameUpdate>;
    private _isBoardValid: boolean = $derived.by(() => !!this._updateManager.mostRecentData.board && GameManager.calcIsBoardValid(this._updateManager.mostRecentData.board));

    constructor(updateManager: UpdateManager<GameFromPlayerPerspective, InProgressGameUpdate>) {
        this._updateManager = updateManager;
    }

    get gameId(): string {
        return this._updateManager.mostRecentData.id;
    }

    get players() {
        return this._updateManager.mostRecentData.players;
    }

    get currentTurnUserId() {
        return this._updateManager.mostRecentData.currentTurnUserId;
    }

    get board() {
        return this._updateManager.mostRecentData.board;
    }

    get userCards(): UserCard[] {
        return this._updateManager.mostRecentData.userCardsIds.map(userCardId => {
            if (userCardId === null) {
                return null;
            }

            return allCardsById.get(userCardId) ?? null;
        });
    }

    get deckSize() {
        return this._updateManager.mostRecentData.deckSize;
    }

    get isItMyTurn() {
        return this._updateManager.mostRecentData.isItMyTurn
    }

    get beforePlayerChangesData(): RelevantCardsForPlayerTurn | null {
        return this._updateManager.mostRecentData.beforePlayerChangesData;
    }

    moveCardFromSlot(from: CardSlotData, to: CardSlotData): void {

        if (!from.cardId) {
            console.error('No card to move from slot', from);
            return;
        }

        const cardToMove = allCardsById.get(from.cardId);

        if (!cardToMove) {
            console.error('No card to move from slot', from);
            return;
        }

        if (to.cardId) {
            console.error('Slot already has a card', to);
            return;
        }

        if (!canPutRealCardOnSlot(cardToMove, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return;
        }

        const moveActions: CardMoveAction[] = [{
            from: { location: 'board', cardId: from.cardId },
            to: { location: 'board', slotId: to.id }
        }];

        fetch(`/api/game/${this.gameId}/move-cards`, {
            method: 'POST',
            body: JSON.stringify(moveActions)
        });
    }

    async moveCardFromUserCards(card: RealCardData, to: CardSlotData): Promise<boolean> {
        if (!canPutRealCardOnSlot(card, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return false;
        }

        const moveActions: CardMoveAction[] = [{
            from: { location: 'user', cardId: card.id },
            to: { location: 'board', slotId: to.id }
        }];

        await fetch(`/api/game/${this.gameId}/move-cards`, {
            method: 'POST',
            body: JSON.stringify(moveActions)
        });

        return true;
    }

    getUserCardsIdsOrderdByColor() {
        const allUserCards = this.userCards.filter(isDefined);

        const { sets: runsSets, otherCards: cardsThatAreNotRuns } = extractRuns(allUserCards);

        const { sets: numberGroupSets, otherCards: cardsThatAreNotSets } = extractNumberGroups(cardsThatAreNotRuns);

        return orderUserCardsBySameComparator(
            {
                sets: [...numberGroupSets, ...runsSets],
                otherCards: cardsThatAreNotSets
            },
            cardByTypeComperator
                .then(cardByColorComparator)
                .then(cardByValueComparator)
        );
    }

    getUserCardsIdsOrderdByValue(): UserCardsOrdered {
        const allUserCards = this.userCards.filter(isDefined);
        // First extract valid number groups.
        const { sets: numberGoupSets, otherCards: notFormNumberGroup } = extractNumberGroups(allUserCards);

        // Next extract runs from the leftover cards.
        const { sets: runsSets, otherCards: cardsThatAreNotSets } = extractRuns(notFormNumberGroup);

        return orderUserCardsBySameComparator(
            {
                sets: [...numberGoupSets, ...runsSets],
                otherCards: cardsThatAreNotSets
            },
            cardByTypeComperator
                .then(cardByValueComparator)
                .then(cardByColorComparator)
        );
    }

    getUserCardsIdsOrderdByValueAndSequentialOfSameColor(): UserCardsOrdered {
        const userCardsOrderedByValue = this.getUserCardsIdsOrderdByValue();

        const numbersGroupedIntoMap = groupByToMap(userCardsOrderedByValue.otherCards, (card) => card.type === 'joker' ? 14 : card.numericValue);

        for (let i = 1; i <= 12; i++) {
            const currentValueCards = numbersGroupedIntoMap.get(i) ?? [];
            const nextValueCards = numbersGroupedIntoMap.get(i + 1) ?? [];

            if (!currentValueCards.length || !nextValueCards.length) {
                continue;
            }

            const colorsOfCurrentValueCards = new Set(currentValueCards.map(x => x.color));
            const colorsOfNextValueCards = new Set(nextValueCards.map(x => x.color));

            const colorsCommonToBothNumbers = colorsOfCurrentValueCards.intersection(colorsOfNextValueCards)

            const aCommonColor = getAnyValue(colorsCommonToBothNumbers);
            if (!aCommonColor) {
                continue;
            }

            const indexOfColoredCardInCurrentValueCards = currentValueCards.findIndex(card => card.color === aCommonColor);
            [currentValueCards[currentValueCards.length - 1], currentValueCards[indexOfColoredCardInCurrentValueCards]] = [currentValueCards[indexOfColoredCardInCurrentValueCards], currentValueCards[currentValueCards.length - 1]]

            const indexOfColoredCardInNextValueCards = nextValueCards.findIndex(card => card.color === aCommonColor);
            [nextValueCards[0], nextValueCards[indexOfColoredCardInNextValueCards]] = [nextValueCards[indexOfColoredCardInNextValueCards], nextValueCards[0]]
        }



        const otherCardsFlattened = numbersGroupedIntoMap.entries().flatMap(entry => entry[1]);

        return {
            sets: userCardsOrderedByValue.sets,
            otherCards: [...otherCardsFlattened],
        }
    }

    getMinimalVisibleBoard(currentlyDraggedCard: RealCardData | null): Board {
        return {
            numberGroups: GameManager.getOnlyBoardsNumberThatShouldBeVisible(this._updateManager.mostRecentData.board.numberGroups, currentlyDraggedCard),
            runs: GameManager.getOnlyBoardsRunsThatShouldBeVisible(this._updateManager.mostRecentData.board.runs, currentlyDraggedCard)
        };

    }

    static getOnlyBoardsNumberThatShouldBeVisible(numberGroups: CardNumberGroup[], currentlyDraggedCard: RealCardData | null): CardNumberGroup[] {
        const groupedNumberGroups = groupByToMap(numberGroups, numberGroup => numberGroup.numericValue);
        return [...groupedNumberGroups.entries()].flatMap(([number, numberGroups]) => {
            return GameManager.calcWhichNumberGroupsOfTheSameNumberToShow(number, numberGroups, currentlyDraggedCard);
        }).sort(compare.byField(numberGroup => numberGroup.id, compare.numbers()));
    }

    private static calcWhichNumberGroupsOfTheSameNumberToShow(num: number, numberGroups: CardNumberGroup[], currentlyDraggedCard: RealCardData | null): CardNumberGroup[] {
        const setsThatHaveACard = numberGroups.filter(slotSet => slotSet.slots.some(slot => slot.cardId));

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
            return GameManager.calcWhichRunsOfTheSameColorToShow(runColor, runs, currentlyDraggedCard)
                .map((_, index) => runs[index]);
        }).sort(compare.byField(run => run.id, compare.numbers()));
    }

    private static calcWhichRunsOfTheSameColorToShow(runColor: NumberCardColor, runs: CardRun[], currentlyDraggedCard: RealCardData | null): CardRun[] {
        const setsThatHaveACard = runs.filter(slotSet => slotSet.slots.some(slot => slot.cardId));

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
        const amountOfCardsInNumberGroup = numberGroup.slots.filter(slot => slot.cardId).length;
        // should be empty or have atleast 3 cards  
        return amountOfCardsInNumberGroup === 0 || amountOfCardsInNumberGroup >= 3;
    }

    static isRunValid(run: CardRun): boolean {
        let currentSetSize = 0;

        for (let index = 0; index < run.slots.length; index++) {
            const slot = run.slots[index];
            if (slot.cardId) {
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

export default GameManager;