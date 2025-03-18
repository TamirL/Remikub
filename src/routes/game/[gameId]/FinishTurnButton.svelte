<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { hasUserMadeContributionsToTheBoard } from '$lib/domain/board';
	import { getGameContext } from '$lib/domain/game';
	import { isDefined } from '$lib/utils/utils';

	const gameContext = getGameContext();

	const hasPlayerMadeContributions = $derived.by(() =>
		hasUserMadeContributionsToTheBoard(
			{
				board: gameContext.gameManager.board,
				playerCardIds: gameContext.gameManager.userCards.filter(isDefined).map((p) => p.id)
			},
			gameContext.gameManager.beforePlayerChangesData
		)
	);

	const isBoardValid = gameContext.gameManager.isBoardValid;
	const isItMyTurn = gameContext.gameManager.isItMyTurn;

	const enableButton = $derived(isItMyTurn && hasPlayerMadeContributions && isBoardValid);
</script>

<form action={`?/finish-turn`} method="POST" use:enhance>
	<Button type="submit" disabled={!enableButton}>Finish Turn</Button>
</form>
