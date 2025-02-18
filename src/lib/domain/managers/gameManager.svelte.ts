import { groupByToMap } from "$lib/utils/arrayUtils";
import { compare } from "$lib/utils/comparatorUtils";
import type { Board, CardNumberGroup, CardRun, CardSlotData } from "../board";
import { allCardsById, canPutRealCardOnSlot, cardByColorComparator, cardByValueComparator, cardByTypeComperator, type CardType, type JokerCardColor, type NumberCardColor, type RealCardData, type RealNumberCardData } from "../cards";
import type { CardMoveAction } from "../gameActions";
import type UpdateManager from "./updateManager.svelte";
import type { GameFromPlayerPerspective, RelevantCardsForPlayerTurn } from "../game";
import type { InProgressGameUpdate } from "../updates";
import { isDefined } from "$lib/utils/utils";
import { orderUserCardsBySameComparator, type UserCard, type UserCardsOrdered } from "../userCards";
``

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

        // Next extract number groups from the leftover cards.
        const { sets: runsSets, otherCards: cardsThatAreNotNumberGroups } = this.extractRuns(allUserCards);

        // First extract valid runs.
        const { sets: numberGoupSets, otherCards: cardsThatAreNotSets } = this.extractNumberGroups(cardsThatAreNotNumberGroups);

        return orderUserCardsBySameComparator(
            {
                sets: [...numberGoupSets, ...runsSets],
                otherCards: cardsThatAreNotSets
            },
            cardByTypeComperator
                .then(cardByColorComparator)
                .then(cardByValueComparator)
        );
    }

    getUserCardsIdsOrderdByValueAndSequentialOfSameColor() {
        const allUserCards = this.userCards.filter(isDefined);
        // First extract valid number groups.
        const { sets: numberGoupSets, otherCards: notFormNumberGroup } = this.extractNumberGroups(allUserCards);

        // Next extract runs from the leftover cards.
        const { sets: runsSets, otherCards: cardsThatAreNotSets } = this.extractRuns(notFormNumberGroup);

        const cardsBeforeStickingCardsOfTheSameColorCloser = orderUserCardsBySameComparator(
            {
                sets: [...numberGoupSets, ...runsSets],
                otherCards: cardsThatAreNotSets
            },
            cardByTypeComperator
                .then(cardByValueComparator)
                .then(cardByColorComparator)
        );


    }

    private extractNumberGroups(userCards: RealCardData[]): UserCardsOrdered {
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

    private extractRuns(userCards: RealCardData[]): UserCardsOrdered {
        const validRuns: RealCardData[][] = [];
        const leftovers: RealCardData[] = [];

        // Group number cards by color (only number cards are considered for runs).
        const cardsByColor = new Map<string, RealNumberCardData[]>();
        for (const card of userCards) {
            if (card.type === 'number') {
                if (!cardsByColor.has(card.color)) {
                    cardsByColor.set(card.color, []);
                }
                cardsByColor.get(card.color)!.push(card);
            } else {
                leftovers.push(card);
            }
        }

        // For each color group, sort the cards and greedily extract runs.
        for (const cards of cardsByColor.values()) {
            // Create a working copy sorted by numericValue.
            const sorted: RealNumberCardData[] = cards.slice().sort((a, b) => a.numericValue - b.numericValue);

            // Continue forming runs as long as at least 3 cards remain.
            while (sorted.length >= 3) {
                const run: RealNumberCardData[] = [];
                const indicesToRemove: number[] = [];

                // Start a run with the first available card.
                run.push(sorted[0]);
                indicesToRemove.push(0);
                let currentValue = sorted[0].numericValue;

                // Look for the next consecutive numbers.
                for (let i = 1; i < sorted.length; i++) {
                    if (sorted[i].numericValue === currentValue + 1) {
                        run.push(sorted[i]);
                        currentValue = sorted[i].numericValue;
                        indicesToRemove.push(i);
                    }
                }

                if (run.length >= 3) {
                    // A valid run is formed. Save it.
                    validRuns.push(run);
                    // Remove the used cards from the sorted array.
                    // Remove in descending order to avoid index shift.
                    indicesToRemove.sort((a, b) => b - a);
                    for (const index of indicesToRemove) {
                        sorted.splice(index, 1);
                    }
                } else {
                    // If we cannot form a valid run, break out.
                    break;
                }
            }
            // Any remaining cards for this color that did not form a run go to leftovers.
            leftovers.push(...sorted);
        }

        return { sets: validRuns, otherCards: leftovers };
    }


    getUserCardsIdsOrderdByValue(): UserCardsOrdered {
        const allUserCards = this.userCards.filter(isDefined);
        // First extract valid number groups.
        const { sets: numberGoupSets, otherCards: notFormNumberGroup } = this.extractNumberGroups(allUserCards);

        // Next extract runs from the leftover cards.
        const { sets: runsSets, otherCards: cardsThatAreNotSets } = this.extractRuns(notFormNumberGroup);

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