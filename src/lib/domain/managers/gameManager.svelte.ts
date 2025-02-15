import { groupByToMap } from "$lib/utils/arrayUtils";
import { compare } from "$lib/utils/comparatorUtils";
import type { Board, CardNumberGroup, CardRun, CardSlotData } from "../board";
import { allCardsById, canPutRealCardOnSlot, cardColorComparator, type CardType, type JokerCardColor, type NumberCardColor, type RealCardData } from "../cards";
import type { CardMoveAction } from "../gameActions";
import type UpdateManager from "./updateManager.svelte";
import type { GameFromPlayerPerspective } from "../game";
import type { InProgressGameUpdate } from "../updates";

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

    get userCards() {
        return this._updateManager.mostRecentData.userCardsIds.map(cardId => allCardsById.get(cardId)).filter(card => !!card) as RealCardData[];
    }

    get deckSize() {
        return this._updateManager.mostRecentData.deckSize;
    }

    get isItMyTurn() {
        return this._updateManager.mostRecentData.isItMyTurn
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

    drawCardFromDeck() {
        if (this._updateManager.mostRecentData.deckSize <= 0) {
            console.error('Deck is empty');
            throw new Error('Deck is empty');
        }

        // TODO: Implement
    }

    getUserCardsIdsOrderdByColor() {
        return this.userCards.toSorted(
            compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
                .then(compare.byField<RealCardData, NumberCardColor | JokerCardColor>(card => card.color, cardColorComparator))
                .then(GameManager.compareCardsByCardValue))
            .map(card => card.id);
    }

    getUserCardsIdsOrderdByValue() {
        return this.userCards.toSorted(
            compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
                .then(GameManager.compareCardsByCardValue)
                .then(compare.byField<RealCardData, NumberCardColor | JokerCardColor>(card => card.color, cardColorComparator)))
            .map(card => card.id);
    }

    private static compareCardsByCardValue(card1: RealCardData, card2: RealCardData): number {
        if (card1.type === 'number' && card2.type === 'number') {
            return card1.numericValue - card2.numericValue;
        }

        if (card1.type === 'joker' && card2.type === 'joker') {
            if (card1.color === 'red') {
                return -1;
            }

            return 1;
        }

        if (card1.type === 'joker') {
            return -1;
        }

        return 1;
    };

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