<script lang="ts">
	import { getGameContext } from '../domain/game';

	const gameContext = getGameContext();

	function drawCard() {
		gameContext.gameManager.drawCardFromDeck();
	}
</script>

<button onclick={drawCard}>Draw Card - {gameContext.deckManager.deck.length}</button>
