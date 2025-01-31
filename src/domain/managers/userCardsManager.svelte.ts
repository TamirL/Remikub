import { compare, type CompareFunction } from "../../utils/comparatorUtils";
import type { CardType, RealCardData } from "../card";

class UserCardsManager {
    private _userCards: RealCardData[] = $state([]);

    constructor(userCards: RealCardData[]) {
        this._userCards = userCards;
    }

    get userCards(): readonly RealCardData[] {
        return this._userCards;
    }

    removeCard(card: RealCardData): void {
        this._userCards = this._userCards.filter(userCard => userCard.id !== card.id);
    }

    addCard(drawnCard: RealCardData) {
        this._userCards.push(drawnCard);
    }

    orderByColor() {
        this._userCards = this._userCards.sort(
            compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
                .then(compare.byField<RealCardData, string>(card => card.color, compare.stringsCaseInsensitive()))
                .then(UserCardsManager.compareCardsByCardValue));
    }

    orderByValue() {
        this._userCards = this._userCards.sort(
            compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
                .then(UserCardsManager.compareCardsByCardValue)
                .then(compare.byField<RealCardData, string>(card => card.color, compare.stringsCaseInsensitive())));
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
}

export default UserCardsManager; 