<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	const buttonEnabled = $derived(gameContext.gameManager.isItMyTurn);

	$inspect(buttonEnabled);

	function drawCard() {
		fetch(`/game/$`, {
			method: 'POST'
		});
	}
</script>

<form action="?/draw-card" method="POST">
	<Button type="submit" disabled={!buttonEnabled}
		>Draw Card - {gameContext.gameManager.deckSize}</Button
	>
</form>
