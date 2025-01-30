import type { RealCardData } from "../card";

class UserCardsManager {
    private _userCards: RealCardData[] = $state([]);

    constructor(userCards: RealCardData[]) {
        this._userCards = userCards;
    }

    get userCards(): readonly RealCardData[] {
        return this._userCards;
    }

    removeCardFromUserCards(card: RealCardData): void {
        this._userCards = this._userCards.filter(userCard => userCard.id !== card.id);
    }
}

export default UserCardsManager; 