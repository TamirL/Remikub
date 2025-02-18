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
				playerCardIds: gameContext.gameManager.userCards.map((p) => p?.id ?? null)
			},
			gameContext.gameManager.beforePlayerChangesData
		)
	);

	const enableButton = $derived(isItMyTurn && hasUserChangedBoard);
</script>

<form action={`?/undo-board-changes`} method="POST">
	<Button type="submit" disabled={!enableButton}>Undo</Button>
</form>
