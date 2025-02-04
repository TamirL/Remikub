import type { RealCardData } from "$lib/domain/card";

class UserCardsManager {
    private _userCards: RealCardData[] = [];

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

        // TODO: Notify user of new card
    }
}

export default UserCardsManager; 