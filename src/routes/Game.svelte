<script lang="ts">
	import { setCardDragDropContext } from '../domain/card';
	import Board from '../components/Board.svelte';
	import UserCards from '../components/UserCards.svelte';
	import { createDeck } from '../domain/deck';

	const dragDropContext = $state({ draggedCard: null });
	setCardDragDropContext(dragDropContext);

	const deck = $state(createDeck());
	const userCards = $derived(deck.slice(0, 14));
</script>

<div>
	<Board />
	<UserCards cards={userCards} />
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
