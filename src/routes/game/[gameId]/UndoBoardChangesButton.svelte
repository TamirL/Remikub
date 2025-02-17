<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { hasUserMadeContributionsToTheTable as hasUserMadeContributionsToTheBoard } from '$lib/domain/board';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	const isItMyTurn = gameContext.gameManager.isItMyTurn;
	const hasUserChangedBoard = $derived.by(() =>
		hasUserMadeContributionsToTheBoard(
			{
				board: gameContext.gameManager.board,
				playerCardIds: gameContext.gameManager.userCards.map((p) => p.id)
			},
			gameContext.gameManager.beforePlayerChangesData
		)
	);

	const enableButton = $derived(isItMyTurn && hasUserChangedBoard);

	$effect(() => {
		console.log('enableButton', enableButton, { isItMyTurn, hasUserChangedBoard });
	});
</script>

<form action={`/game/${gameContext.gameManager.gameId}?/undo-board-changes`} method="POST">
	<Button type="submit" disabled={!enableButton}>Undo</Button>
</form>
