<script lang="ts">
	import { getGameContext } from '../domain/game';
	import Button from './Button.svelte';

	const gameContext = getGameContext();

	function drawCard() {
		gameContext.gameManager.drawCardFromDeck();
	}
</script>

<Button onclick={drawCard}>Draw Card - {gameContext.deckManager.deck.length}</Button>
