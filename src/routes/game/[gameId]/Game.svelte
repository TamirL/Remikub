<script lang="ts">
	import { setCardDragDropContext } from '$lib/domain/card';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { setGameContext } from '$lib/domain/game';
	import type { GameFromPlayerPerspective } from '$lib/domain/game';
	import GameManager from '$lib/domain/managers/gameManager.svelte';

	const { game }: { game: GameFromPlayerPerspective } = $props();
	const dragDropContext = $state({ draggedCard: null, draggedFrom: null });
	setCardDragDropContext(dragDropContext);

	const gameManager = $state(new GameManager(game));

	setGameContext({ gameManager });
</script>

<div>
	<Board />
	<UserCards cards={game.userCards} />
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
