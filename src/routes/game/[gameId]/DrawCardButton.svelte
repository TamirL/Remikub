<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	const buttonEnabled = $derived(gameContext.gameManager.isItMyTurn);
</script>

<form action="?/draw-card" method="POST" use:enhance>
	<Button type="submit" disabled={!buttonEnabled}
		>Draw Card - {gameContext.gameManager.deckSize}</Button
	>
</form>
