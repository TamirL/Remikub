<script lang="ts">
	import { getGameContext } from '../domain/game';
	import Button from './Button.svelte';

	const gameContext = getGameContext();

	function orderByColor() {
		gameContext.userCardsManager.orderByColor();
	}
</script>

<Button onclick={orderByColor}>123</Button>
