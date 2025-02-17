<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	const buttonEnabled = gameContext.gameManager.isItMyTurn;

	function drawCard() {
		fetch(`/game/$`, {
			method: 'POST'
		});
	}
</script>

<form action="/game/{gameContext.gameManager.gameId}?/draw-card">
	<Button type="submit" disabled={!buttonEnabled}
		>Draw Card - {gameContext.gameManager.deckSize}</Button
	>
</form>
