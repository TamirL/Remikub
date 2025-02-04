import { groupByToMap } from "$lib/utils/arrayUtils";
import { compare } from "$lib/utils/comparatorUtils";
import type { Board, CardNumberGroup, CardRun, CardSlotData } from "../board";
import { canPutRealCardOnSlot, type NumberCardColor, type RealCardData } from "../card";
import type { GameFromPlayerPerspective } from "../game";

class GameManager {
    private _gameData: GameFromPlayerPerspective = $state({} as GameFromPlayerPerspective);
    private _isBoardValid: boolean = $derived.by(() => !!this._gameData.board && GameManager.calcIsBoardValid(this._gameData.board));

    constructor(gameData: GameFromPlayerPerspective) {
        this._gameData = gameData;
    }

    get gameId(): string {
        return this._gameData.id;
    }

    get players() {
        return this._gameData.players;
    }

    get board() {
        return this._gameData.board;
    }

    get userCards() {
        return this._gameData.userCards;
    }

    get deckSize() {
        return this._gameData.deckSize;
    }

    moveCardFromSlot(from: CardSlotData, to: CardSlotData): void {
        const cardToMove = from.card;

        if (!cardToMove) {
            console.error('No card to move from slot', from);
            return;
        }

        if (to.card) {
            console.error('Slot already has a card', to);
            return;
        }

        if (!canPutRealCardOnSlot(cardToMove, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return;
        }

        from.card = null;
        to.card = cardToMove;

        // TODO: implement
    }

    moveCardFromUserCards(card: RealCardData, to: CardSlotData): boolean {
        if (!canPutRealCardOnSlot(card, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return false;
        }

        this._gameData.userCards = this._gameData.userCards.filter(c => c.id !== card.id);
        to.card = card;
        return true;
        // TODO: implement
    }

    drawCardFromDeck() {
        if (this._gameData.deckSize <= 0) {
            console.error('Deck is empty');
            throw new Error('Deck is empty');
        }

        // TODO: Implement
    }

    orderByColor() {
        //     this._userCards = this._gameData.userCards.sort(
        //         compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
        //             .then(compare.byField<RealCardData, NumberCardColor | JokerCardColor>(card => card.color, cardColorComparator))
        //             .then(UserCardsManager.compareCardsByCardValue));
    }

    orderByValue() {
        //     this._userCards = this._userCards.sort(
        //         compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
        //             .then(UserCardsManager.compareCardsByCardValue)
        //             .then(compare.byField<RealCardData, NumberCardColor | JokerCardColor>(card => card.color, cardColorComparator)));
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
            numberGroups: GameManager.getOnlyBoardsNumberThatShouldBeVisible(this._gameData.board.numberGroups, currentlyDraggedCard),
            runs: GameManager.getOnlyBoardsRunsThatShouldBeVisible(this._gameData.board.runs, currentlyDraggedCard)
        };

    }

    static getOnlyBoardsNumberThatShouldBeVisible(numberGroups: CardNumberGroup[], currentlyDraggedCard: RealCardData | null): CardNumberGroup[] {
        const groupedNumberGroups = groupByToMap(numberGroups, numberGroup => numberGroup.numericValue);
        return [...groupedNumberGroups.entries()].flatMap(([number, numberGroups]) => {
            return GameManager.calcWhichNumberGroupsOfTheSameNumberToShow(number, numberGroups, currentlyDraggedCard);
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
            return GameManager.calcWhichRunsOfTheSameColorToShow(runColor, runs, currentlyDraggedCard)
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

export default GameManager;