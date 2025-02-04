<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getGameContext } from '$lib/domain/game';

	const gameContext = getGameContext();

	function drawCard() {
		gameContext.gameManager.drawCardFromDeck();
	}
</script>

<Button onclick={drawCard}>Draw Card - {gameContext.deckManager.deck.length}</Button>
