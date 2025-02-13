<script lang="ts">
	import { setCardDragDropContext } from '$lib/domain/cards';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { getGameContext, setGameContext } from '$lib/domain/game';
	import type { GameFromPlayerPerspective } from '$lib/domain/game';
	import GameManager from '$lib/domain/managers/gameManager.svelte';

	const dragDropContext = $state({ draggedCard: null, draggedFrom: null });
	setCardDragDropContext(dragDropContext);
	const gameContext = getGameContext();
</script>

<div>
	<Board />
	<UserCards cards={gameContext.gameManager.userCards} />
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
