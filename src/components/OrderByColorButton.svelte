<script lang="ts">
	import { getGameContext } from '../domain/game';
	import Button from '$lib/Button.svelte';

	const gameContext = getGameContext();

	function orderByColor() {
		gameContext.userCardsManager.orderByColor();
	}
</script>

<Button onclick={orderByColor}>123</Button>
