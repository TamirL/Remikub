<script lang="ts">
	import { setCardDragDropContext } from '$lib/domain/card';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { createDeck } from '$lib/server/domain/deck';
	import GameManager from '$lib/domain/managers/gameManager.svelte';
	import { createEmptyBoard } from '$lib/domain/board';

	import DeckManager from '$lib/domain/managers/deckManager.svelte';
	import { setGameContext } from '$lib/domain/game';
	import UserCardsManager from '$lib/domain/managers/userCardsManager.svelte';
	import BoardManager from '$lib/domain/managers/boardManager.svelte';
	const dragDropContext = $state({ draggedCard: null, draggedFrom: null });
	setCardDragDropContext(dragDropContext);

	const deck = createDeck();
	const userCards = deck.splice(0, 14);
	const deckManager = new DeckManager(deck);
	const boardManager = new BoardManager(createEmptyBoard());
	const userCardsManager = new UserCardsManager(userCards);
	const gameManager = $state({
		gameManager: new GameManager(deckManager, boardManager, userCardsManager),
		boardManager,
		userCardsManager,
		deckManager
	});
	setGameContext(gameManager);
</script>

<div>
	<Board />
	<UserCards cards={userCardsManager.userCards} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;

		flex: 1;
		overflow: auto;
		min-height: 0;
	}
</style>
