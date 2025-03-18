<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { hasUserMadeChangesToTheBoard } from '$lib/domain/board';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	const isItMyTurn = gameContext.gameManager.isItMyTurn;
	const hasUserChangedBoard = $derived.by(() =>
		hasUserMadeChangesToTheBoard(
			{
				board: gameContext.gameManager.board,
				playerCardIds: gameContext.gameManager.userCards.map((p) => p?.id ?? null)
			},
			gameContext.gameManager.beforePlayerChangesData
		)
	);

	const enableButton = $derived(isItMyTurn && hasUserChangedBoard);
</script>

<form action={`?/undo-board-changes`} method="POST" use:enhance>
	<Button type="submit" disabled={!enableButton}>Undo</Button>
</form>
